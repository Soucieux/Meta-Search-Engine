import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ls from "local-storage";

const FIRST_TITLE = "McDonald's Canada: Your Favourite Burgers, Fries & More";
// 示例结果中只有这一条的网站是 www.facebook.com
const FACEBOOK_TITLE = "McDonalds Jobs in Ottawa, ON (with Salaries) - Indeed";

/**
 * 重新载入应用并在指定地址打开。应用模块载入时会初始化 local storage 和模块内的筛选状态，
 * 因此每次打开前都重新载入，与刷新网页相同：已存入 local storage 的数据保留。
 * @param {string} path 打开的地址，例如 "/" 或 "/results"
 */
async function openApp(path) {
  vi.resetModules();
  const { default: Router } = await import("./router");
  render(
    <MemoryRouter initialEntries={[path]}>
      <Router />
    </MemoryRouter>
  );
}

/**
 * 在搜索框输入内容。
 * @param {string} text 输入的内容
 */
function typeQuery(text) {
  fireEvent.change(screen.getByRole("textbox"), { target: { value: text } });
}

/**
 * 输入内容并点击搜索按钮。
 * @param {string} text 搜索的内容
 */
function search(text) {
  typeQuery(text);
  fireEvent.click(document.getElementById("search-button-submit"));
}

/**
 * @returns {string[]} 结果页上按显示顺序排列的搜索结果标题
 */
function resultTitles() {
  return Array.from(
    document.querySelectorAll("#search-result-link"),
    (link) => link.textContent
  );
}

/**
 * @param {string} title 搜索结果标题
 * @returns {HTMLElement} 这条搜索结果的收藏按钮
 */
function favouriteButtonOf(title) {
  return within(
    screen.getByText(title).closest("#search-result-individual")
  ).getByRole("button");
}

beforeEach(() => {
  localStorage.clear();
  // 应用在每次渲染时都输出调试信息，测试中不显示
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("search", () => {
  it("shows the six sample results for a query typed on the home page", async () => {
    await openApp("/");

    search("burgers");

    expect(resultTitles()).toHaveLength(6);
    expect(resultTitles()[0]).toBe(FIRST_TITLE);
    expect(ls.get("previous input")).toBe("burgers");
  });

  it("searches when Enter is pressed", async () => {
    await openApp("/");
    typeQuery("burgers");

    fireEvent.keyPress(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });

    expect(resultTitles()).toHaveLength(6);
  });

  it("links each result to its site in a new tab", async () => {
    await openApp("/");

    search("burgers");

    const link = screen.getByText(FIRST_TITLE);
    expect(link.getAttribute("href")).toBe("//www.mcdonalds.com/ca/en-ca.html");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("returns to the home page when the results page has no query", async () => {
    await openApp("/results");

    expect(screen.queryByText("Websites Filter")).toBeNull();
    expect(document.getElementById("main-image")).not.toBeNull();
  });
});

describe("clear button", () => {
  it("empties the search box and the saved query", async () => {
    await openApp("/");
    typeQuery("burgers");
    const clearButton = screen.getByRole("button", { name: "Close" });
    expect(clearButton.style.visibility).toBe("visible");

    fireEvent.click(clearButton);

    expect(screen.getByRole("textbox").value).toBe("");
    expect(ls.get("current input")).toBe("");
    expect(clearButton.style.visibility).toBe("hidden");
  });
});

describe("websites filter", () => {
  it("lists each site in the results once", async () => {
    await openApp("/");

    search("burgers");

    const filter = document.getElementById("websites-filter");
    expect(
      within(filter)
        .getAllByRole("button")
        .map((button) => button.textContent)
    ).toEqual([
      "www.mcdonalds.com",
      "en.wikipeida.org",
      "www.facebook.com",
      "www.youtube.com",
    ]);
  });

  it("hides and shows a site's results when its button is clicked", async () => {
    await openApp("/");
    search("burgers");
    const siteButton = screen.getByRole("button", { name: "www.facebook.com" });

    fireEvent.click(siteButton);

    expect(resultTitles()).toHaveLength(5);
    expect(resultTitles()).not.toContain(FACEBOOK_TITLE);
    expect(ls.get("exclude websites")).toEqual(["www.facebook.com"]);

    fireEvent.click(siteButton);

    expect(resultTitles()).toHaveLength(6);
    expect(ls.get("exclude websites")).toEqual([]);
  });

  it("hides and shows a site's results when its tick box is clicked", async () => {
    await openApp("/");
    search("burgers");
    const tickBox = screen.getAllByRole("checkbox")[2];
    expect(tickBox.checked).toBe(true);

    fireEvent.click(tickBox);

    expect(tickBox.checked).toBe(false);
    expect(resultTitles()).not.toContain(FACEBOOK_TITLE);

    fireEvent.click(tickBox);

    expect(tickBox.checked).toBe(true);
    expect(resultTitles()).toHaveLength(6);
  });
});

describe("search engine filter", () => {
  it("hides and shows the Google results", async () => {
    await openApp("/");
    search("burgers");
    const googleButton = screen.getByAltText("Google").closest("button");

    fireEvent.click(googleButton);

    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("No results for the selected filters")).not.toBeNull();
    expect(screen.getByText("No websites")).not.toBeNull();

    fireEvent.click(googleButton);

    expect(resultTitles()).toHaveLength(6);
  });
});

describe("favourites", () => {
  it("saves a result and removes it again", async () => {
    await openApp("/");
    search("burgers");
    const button = favouriteButtonOf(FIRST_TITLE);

    fireEvent.click(button);

    expect(button.textContent).toBe("Remove");
    expect(ls.get("favourite websites").map((page) => page.title)).toEqual([
      FIRST_TITLE,
    ]);

    fireEvent.click(button);

    expect(button.textContent).toBe("Favourite");
    expect(ls.get("favourite websites")).toEqual([]);
  });

  it("lists saved results in My Pages and keeps them saved after going back", async () => {
    await openApp("/");
    search("burgers");
    fireEvent.click(favouriteButtonOf(FIRST_TITLE));

    fireEvent.click(document.getElementById("favourite-pages-icon-after"));

    expect(screen.getByRole("heading", { name: "My Pages" })).not.toBeNull();
    expect(screen.getByText(FIRST_TITLE)).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "<Go back" }));
    const button = favouriteButtonOf(FIRST_TITLE);
    expect(button.textContent).toBe("Remove");

    fireEvent.click(button);

    expect(ls.get("favourite websites")).toEqual([]);
  });
});

describe("local storage", () => {
  it("keeps the query, the websites filter and the favourites after a reload", async () => {
    await openApp("/");
    search("burgers");
    fireEvent.click(screen.getByRole("button", { name: "www.facebook.com" }));
    fireEvent.click(favouriteButtonOf(FIRST_TITLE));
    cleanup();

    await openApp("/results");

    expect(screen.getByRole("textbox").value).toBe("burgers");
    expect(resultTitles()).toHaveLength(5);
    expect(resultTitles()).not.toContain(FACEBOOK_TITLE);
    expect(favouriteButtonOf(FIRST_TITLE).textContent).toBe("Remove");
  });
});
