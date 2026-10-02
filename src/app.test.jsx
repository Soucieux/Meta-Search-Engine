import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ls from "local-storage";

const FIRST_TITLE = "McDonald's Canada: Your Favourite Burgers, Fries & More";
// 示例结果中只有这一条的网站是 www.facebook.com
const FACEBOOK_TITLE = "McDonalds Jobs in Ottawa, ON (with Salaries) - Indeed";
const NEW_TAB_NOTE = " (opens in a new tab)";

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
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
}

/**
 * @returns {string[]} 结果页上按显示顺序排列的搜索结果标题
 */
function resultTitles() {
  return Array.from(
    document.querySelectorAll(".result__title a"),
    (link) => link.textContent
  );
}

/**
 * @param {string} title 搜索结果标题
 * @returns {HTMLElement} 这条搜索结果的收藏按钮
 */
function favouriteButtonOf(title) {
  return within(screen.getByText(title).closest("article")).getByRole("button");
}

/**
 * @param {string} website 网站，例如 "www.facebook.com"
 * @returns {HTMLElement} 网站筛选中这个网站的勾选框
 */
function websiteCheckbox(website) {
  return screen.getByRole("checkbox", { name: (name) => name.startsWith(website) });
}

/**
 * @returns {string} 结果页的状态行，或 My Pages 标题旁的数量
 */
function statusText() {
  return screen.getByRole("status").textContent;
}

/** 从结果页点击 My Pages，再点击 Go back 返回结果页 */
function visitMyPagesAndGoBack() {
  fireEvent.click(screen.getByRole("link", { name: "My Pages" }));
  fireEvent.click(screen.getByRole("link", { name: "Go back" }));
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
  it("shows the six numbered sample results for a query typed on the home page", async () => {
    await openApp("/");

    search("burgers");

    expect(resultTitles()).toHaveLength(6);
    expect(resultTitles()[0]).toBe(FIRST_TITLE);
    expect(document.querySelector(".result__num").textContent).toBe("01");
    expect(statusText()).toBe("6 results · “burgers”");
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
    expect(
      screen.getByRole("heading", { level: 1, name: "Custom Search" })
    ).not.toBeNull();
  });
});

describe("clear button", () => {
  it("empties the search box and the saved query", async () => {
    await openApp("/");
    typeQuery("burgers");
    const clearButton = screen.getByRole("button", { name: "Clear the search box" });
    expect(clearButton.style.visibility).toBe("visible");

    fireEvent.click(clearButton);

    expect(screen.getByRole("textbox").value).toBe("");
    expect(ls.get("current input")).toBe("");
    expect(clearButton.style.visibility).toBe("hidden");
  });
});

describe("websites filter", () => {
  it("lists each site in the results once, with its number of results", async () => {
    await openApp("/");

    search("burgers");

    const names = document.querySelectorAll(".filter__name");
    const counts = document.querySelectorAll(".filter__count");
    expect(Array.from(names, (name) => name.textContent)).toEqual([
      "www.mcdonalds.com",
      "en.wikipeida.org",
      "www.facebook.com",
      "www.youtube.com",
    ]);
    expect(Array.from(counts, (count) => count.textContent)).toEqual([
      "2 results",
      "2 results",
      "1 results",
      "1 results",
    ]);
  });

  it("hides and shows a site's results when its row is clicked", async () => {
    await openApp("/");
    search("burgers");
    // 网站名也出现在搜索结果的地址中，因此只在网站筛选中查找
    const siteName = () =>
      within(screen.getByRole("complementary")).getByText("www.facebook.com");

    fireEvent.click(siteName());

    expect(resultTitles()).toHaveLength(5);
    expect(resultTitles()).not.toContain(FACEBOOK_TITLE);
    expect(ls.get("exclude websites")).toEqual(["www.facebook.com"]);
    expect(statusText()).toBe("5 of 6 results · 1 website hidden");

    fireEvent.click(siteName());

    expect(resultTitles()).toHaveLength(6);
    expect(ls.get("exclude websites")).toEqual([]);
  });

  it("hides and shows a site's results when its tick box is clicked", async () => {
    await openApp("/");
    search("burgers");
    expect(websiteCheckbox("www.facebook.com").checked).toBe(true);

    fireEvent.click(websiteCheckbox("www.facebook.com"));

    expect(websiteCheckbox("www.facebook.com").checked).toBe(false);
    expect(resultTitles()).not.toContain(FACEBOOK_TITLE);

    fireEvent.click(websiteCheckbox("www.facebook.com"));

    expect(websiteCheckbox("www.facebook.com").checked).toBe(true);
    expect(resultTitles()).toHaveLength(6);
  });

  it("shows the empty state when every site is unticked", async () => {
    await openApp("/");
    search("burgers");

    ["www.mcdonalds.com", "en.wikipeida.org", "www.facebook.com", "www.youtube.com"].forEach(
      (website) => fireEvent.click(websiteCheckbox(website))
    );

    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("No results for the selected filters")).not.toBeNull();
    expect(statusText()).toBe("0 of 6 results · all websites hidden");
  });
});

describe("search engine filter", () => {
  it("hides and shows the Google results", async () => {
    await openApp("/");
    search("burgers");
    const googleButton = screen.getByRole("button", { name: "Google" });
    expect(googleButton.getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(googleButton);

    expect(screen.getByRole("button", { name: "Google" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("Google results are hidden")).not.toBeNull();
    expect(screen.getByText("No websites")).not.toBeNull();
    expect(statusText()).toBe("Google results hidden");

    fireEvent.click(screen.getByRole("button", { name: "Google" }));

    expect(resultTitles()).toHaveLength(6);
  });

  it("switches Google on the home page without leaving it", async () => {
    await openApp("/");
    typeQuery("burgers");

    fireEvent.click(screen.getByRole("button", { name: "Google" }));

    expect(screen.getByRole("button", { name: "Google" }).getAttribute("aria-pressed")).toBe(
      "false"
    );
    expect(screen.queryByText("Websites Filter")).toBeNull();
    expect(screen.getByRole("textbox").value).toBe("burgers");

    fireEvent.click(screen.getByRole("button", { name: "Google" }));

    expect(screen.getByRole("button", { name: "Google" }).getAttribute("aria-pressed")).toBe(
      "true"
    );
  });

  it("keeps the Google results hidden for a search made after turning Google off", async () => {
    await openApp("/");
    fireEvent.click(screen.getByRole("button", { name: "Google" }));

    search("burgers");

    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("Google results are hidden")).not.toBeNull();
    expect(statusText()).toBe("Google results hidden");
  });

  it("shows Bing as unavailable and does nothing when it is clicked", async () => {
    await openApp("/");
    search("burgers");
    const bingButton = screen.getByRole("button", { name: /^Bing/ });
    expect(bingButton.getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(bingButton);

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

    fireEvent.click(screen.getByRole("link", { name: "My Pages" }));

    expect(screen.getByRole("heading", { level: 1, name: "My Pages" })).not.toBeNull();
    expect(
      screen.getByRole("link", { name: FIRST_TITLE + NEW_TAB_NOTE })
    ).not.toBeNull();

    fireEvent.click(screen.getByRole("link", { name: "Go back" }));
    const button = favouriteButtonOf(FIRST_TITLE);
    expect(button.textContent).toBe("Remove");

    fireEvent.click(button);

    expect(ls.get("favourite websites")).toEqual([]);
  });
});

describe("saved results", () => {
  it("colours and tags a result as soon as it is saved, without moving it yet", async () => {
    await openApp("/");
    search("burgers");
    const title = resultTitles()[2];
    const result = screen.getByText(title).closest("article");

    fireEvent.click(favouriteButtonOf(title));

    expect(result.className).toBe("result result--saved");
    expect(within(result).getByText("Saved")).not.toBeNull();
    expect(resultTitles()[2]).toBe(title);

    fireEvent.click(favouriteButtonOf(title));

    expect(result.className).toBe("result");
    expect(within(result).queryByText("Saved")).toBeNull();
  });

  it("lists saved results first when the results page is drawn again", async () => {
    await openApp("/");
    search("burgers");
    const titles = resultTitles();
    fireEvent.click(favouriteButtonOf(titles[2]));
    fireEvent.click(favouriteButtonOf(titles[4]));

    visitMyPagesAndGoBack();

    expect(resultTitles()).toEqual([
      titles[2],
      titles[4],
      titles[0],
      titles[1],
      titles[3],
      titles[5],
    ]);
    expect(document.querySelectorAll(".result--saved")).toHaveLength(2);
  });
});

describe("My Pages", () => {
  it("removes a page from its card and shows the empty state after the last one", async () => {
    await openApp("/");
    search("burgers");
    fireEvent.click(favouriteButtonOf(FIRST_TITLE));
    fireEvent.click(favouriteButtonOf(FACEBOOK_TITLE));
    fireEvent.click(screen.getByRole("link", { name: "My Pages" }));
    expect(statusText()).toBe("2 saved pages");
    const firstCard = screen
      .getByRole("link", { name: FIRST_TITLE + NEW_TAB_NOTE })
      .closest("article");

    fireEvent.click(within(firstCard).getByRole("button", { name: "Remove" }));

    expect(statusText()).toBe("1 saved page");
    expect(ls.get("favourite websites").map((page) => page.title)).toEqual([
      FACEBOOK_TITLE,
    ]);

    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(statusText()).toBe("No saved pages");
    expect(screen.getByText("No saved pages yet")).not.toBeNull();
    expect(screen.getByRole("link", { name: "Go to search" })).not.toBeNull();
  });

  it("shows the empty state when nothing is saved", async () => {
    await openApp("/favourite");

    expect(screen.getByText("No saved pages yet")).not.toBeNull();
    expect(statusText()).toBe("No saved pages");
  });
});

describe("local storage", () => {
  it("keeps the query, the websites filter and the favourites after a reload", async () => {
    await openApp("/");
    search("burgers");
    fireEvent.click(websiteCheckbox("www.facebook.com"));
    fireEvent.click(favouriteButtonOf(FIRST_TITLE));
    cleanup();

    await openApp("/results");

    expect(screen.getByRole("textbox").value).toBe("burgers");
    expect(resultTitles()).toHaveLength(5);
    expect(resultTitles()).not.toContain(FACEBOOK_TITLE);
    expect(favouriteButtonOf(FIRST_TITLE).textContent).toBe("Remove");
  });
});
