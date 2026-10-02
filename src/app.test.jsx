import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import ls from "local-storage";

// 测试用的 Tavily 结果：4 个网站各 2 个网页，按 Tavily 返回的顺序排列
const RESULTS = [
  result("www.burgerplace.com", "menu/classic-burgers", "Classic burgers and fries menu", "Our classic burgers are grilled to order with fresh beef, cheese and pickles."),
  result("www.burgerplace.com", "blog/grilling-tips", "Grilling tips for juicy burgers", "Season the beef, keep the grill hot and let the burgers rest before serving."),
  result("www.citynews.com", "local/council-budget", "City council approves road budget", "The city council approved a new budget for road repairs on Tuesday."),
  result("www.citynews.com", "sports/local-team-wins", "Local team wins the championship", "The local team won the championship after a close final game."),
  result("www.healthclinic.com", "back-pain", "Back pain treatment and posture", "Our clinic treats back pain with exercise and posture advice."),
  result("www.healthclinic.com", "sleep-tips", "Why some people sleep easier", "A new study looks at why some people sleep easily during the day."),
  result("www.travelguide.com", "paris", "A weekend guide to Paris", "Museums, cafes and walks for a weekend in Paris."),
  result("www.travelguide.com", "rome-food", "Where to eat in Rome", "From pizza to burgers, the best places to eat in Rome."),
];
const TITLES = RESULTS.map((r) => r.title);
const [CLASSIC, , COUNCIL, TEAM, , SLEEP] = TITLES;
const NEW_TAB_NOTE = " (opens in a new tab)";

/**
 * @param {string} domain 网站
 * @param {string} path 网址路径
 * @param {string} title 标题
 * @param {string} content 摘录
 * @returns {{title: string, url: string, content: string}} 开发服务器转交的 Tavily 结果
 */
function result(domain, path, title, content) {
  return { title, url: `https://${domain}/${path}`, content };
}

/**
 * 代替浏览器的 fetch：开发服务器的在线搜索。
 * @param {{live?: string, results?: Object[]}} options live 为在线搜索的状态，
 *   不是 "ok" 时为没有结果的原因；results 为 Tavily 的结果
 * @returns {function} fetch
 */
function fakeFetch({ live = "ok", results = RESULTS } = {}) {
  return vi.fn(async (url) => {
    if (!url.startsWith("/live/search?q=")) {
      throw new Error(`unexpected fetch ${url}`);
    }
    let body = live === "ok" ? { status: live, results } : { status: live };
    return { ok: true, json: async () => body };
  });
}

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
 * 输入内容，点击搜索按钮，并等待网页搜索完成。
 * @param {string} text 搜索的内容
 */
async function search(text) {
  typeQuery(text);
  fireEvent.click(screen.getByRole("button", { name: "Search" }));
  await searchFinished();
}

/** 等待状态行不再显示正在搜索 */
async function searchFinished() {
  await waitFor(() => expect(statusText()).not.toMatch(/^Searching/));
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
 * @param {string} website 网站，例如 "www.citynews.com"
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
  vi.stubGlobal("fetch", fakeFetch());
  // 应用在每次渲染时都输出调试信息，测试中不显示
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("search", () => {
  it("lists live results in Tavily's order for a query typed on the home page", async () => {
    await openApp("/");

    await search("burgers");

    expect(fetch).toHaveBeenCalledWith("/live/search?q=burgers");
    expect(resultTitles()).toEqual(TITLES);
    expect(document.querySelector(".result__num").textContent).toBe("01");
    expect(statusText()).toBe("8 results · “burgers”");
    expect(ls.get("previous input")).toBe("burgers");
    expect(screen.getByRole("link", { name: "Tavily" }).getAttribute("href")).toBe(
      "https://tavily.com"
    );
  });

  it("searches when Enter is pressed", async () => {
    await openApp("/");
    typeQuery("burgers");

    fireEvent.keyPress(screen.getByRole("textbox"), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    await searchFinished();

    expect(resultTitles()[0]).toBe(CLASSIC);
  });

  it("links each result to its page in a new tab", async () => {
    await openApp("/");

    await search("burgers");

    const link = screen.getByText(CLASSIC);
    expect(link.getAttribute("href")).toBe("//www.burgerplace.com/menu/classic-burgers");
    expect(link.getAttribute("target")).toBe("_blank");
  });

  it("bolds the search words in each snippet", async () => {
    await openApp("/");

    await search("burgers");

    const snippet = screen.getByText(CLASSIC).closest("article").querySelector(".result__snippet");
    expect(Array.from(snippet.querySelectorAll("b"), (bold) => bold.textContent)).toEqual([
      "burgers",
    ]);
  });

  it("says when Tavily finds no pages", async () => {
    vi.stubGlobal("fetch", fakeFetch({ results: [] }));
    await openApp("/");

    await search("zebra");

    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("No pages match “zebra”")).not.toBeNull();
  });

  it.each([
    ["nokey", "Live search needs a Tavily key", /TAVILY_API_KEY/],
    ["badkey", "Tavily didn't accept the key", /Check TAVILY_API_KEY/],
    ["limit", "This month's free searches are used up", /resets every month/],
    ["unavailable", "Live search didn't answer", /internet connection/],
  ])("explains why live search has no results: %s", async (live, heading, body) => {
    vi.stubGlobal("fetch", fakeFetch({ live }));
    await openApp("/");

    await search("burgers");

    expect(resultTitles()).toHaveLength(0);
    expect(statusText()).toBe(heading);
    expect(screen.getByRole("heading", { name: heading })).not.toBeNull();
    expect(screen.getByText(body)).not.toBeNull();
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

    await search("burgers");

    const names = document.querySelectorAll(".filter__name");
    const counts = document.querySelectorAll(".filter__count");
    expect(Array.from(names, (name) => name.textContent)).toEqual([
      "www.burgerplace.com",
      "www.citynews.com",
      "www.healthclinic.com",
      "www.travelguide.com",
    ]);
    expect(Array.from(counts, (count) => count.textContent)).toEqual([
      "2 results",
      "2 results",
      "2 results",
      "2 results",
    ]);
  });

  it("hides and shows a site's results when its row is clicked", async () => {
    await openApp("/");
    await search("burgers");
    // 网站名也出现在搜索结果的地址中，因此只在网站筛选中查找
    const siteName = () =>
      within(screen.getByRole("complementary")).getByText("www.citynews.com");

    fireEvent.click(siteName());

    expect(resultTitles()).toHaveLength(6);
    expect(resultTitles()).not.toContain(COUNCIL);
    expect(ls.get("exclude websites")).toEqual(["www.citynews.com"]);
    expect(statusText()).toBe("6 of 8 results · 1 website hidden");

    fireEvent.click(siteName());

    expect(resultTitles()).toHaveLength(8);
    expect(ls.get("exclude websites")).toEqual([]);
  });

  it("hides and shows a site's results when its tick box is clicked", async () => {
    await openApp("/");
    await search("burgers");
    expect(websiteCheckbox("www.citynews.com").checked).toBe(true);

    fireEvent.click(websiteCheckbox("www.citynews.com"));

    expect(websiteCheckbox("www.citynews.com").checked).toBe(false);
    expect(resultTitles()).not.toContain(TEAM);

    fireEvent.click(websiteCheckbox("www.citynews.com"));

    expect(websiteCheckbox("www.citynews.com").checked).toBe(true);
    expect(resultTitles()).toHaveLength(8);
  });

  it("shows the empty state when every site is unticked", async () => {
    await openApp("/");
    await search("burgers");

    ["www.burgerplace.com", "www.travelguide.com", "www.citynews.com", "www.healthclinic.com"].forEach(
      (website) => fireEvent.click(websiteCheckbox(website))
    );

    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("No results for the selected filters")).not.toBeNull();
    expect(statusText()).toBe("0 of 8 results · all websites hidden");
  });
});

describe("sources", () => {
  it("hides and shows the web results", async () => {
    await openApp("/");
    await search("burgers");
    const web = () => screen.getByRole("button", { name: "Web" });
    expect(web().getAttribute("aria-pressed")).toBe("true");

    fireEvent.click(web());

    expect(web().getAttribute("aria-pressed")).toBe("false");
    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("Web results are hidden")).not.toBeNull();
    expect(screen.getByText("No websites")).not.toBeNull();
    expect(statusText()).toBe("Web results hidden");

    fireEvent.click(web());

    expect(resultTitles()).toHaveLength(8);
  });

  it("switches the web source on the home page without leaving it", async () => {
    await openApp("/");
    typeQuery("burgers");

    fireEvent.click(screen.getByRole("button", { name: "Web" }));

    expect(screen.getByRole("button", { name: "Web" }).getAttribute("aria-pressed")).toBe("false");
    expect(screen.queryByText("Websites Filter")).toBeNull();
    expect(screen.getByRole("textbox").value).toBe("burgers");
  });

  it("keeps the web results hidden for a search made after turning it off", async () => {
    await openApp("/");
    fireEvent.click(screen.getByRole("button", { name: "Web" }));

    await search("burgers");

    expect(resultTitles()).toHaveLength(0);
    expect(screen.getByText("Web results are hidden")).not.toBeNull();
    expect(statusText()).toBe("Web results hidden");
  });

  it("shows Google and Bing as unavailable and does nothing when they are clicked", async () => {
    await openApp("/");
    await search("burgers");

    for (const name of [/^Google/, /^Bing/]) {
      const button = screen.getByRole("button", { name });
      expect(button.getAttribute("aria-disabled")).toBe("true");
      fireEvent.click(button);
    }

    expect(resultTitles()).toHaveLength(8);
  });
});

describe("favourites", () => {
  it("saves a result and removes it again", async () => {
    await openApp("/");
    await search("burgers");
    const button = favouriteButtonOf(CLASSIC);

    fireEvent.click(button);

    expect(button.textContent).toBe("Remove");
    expect(ls.get("favourite websites").map((saved) => saved.title)).toEqual([CLASSIC]);

    fireEvent.click(button);

    expect(button.textContent).toBe("Favourite");
    expect(ls.get("favourite websites")).toEqual([]);
  });

  it("lists saved results in My Pages and keeps them saved after going back", async () => {
    await openApp("/");
    await search("burgers");
    fireEvent.click(favouriteButtonOf(CLASSIC));

    fireEvent.click(screen.getByRole("link", { name: "My Pages" }));

    expect(screen.getByRole("heading", { level: 1, name: "My Pages" })).not.toBeNull();
    expect(screen.getByRole("link", { name: CLASSIC + NEW_TAB_NOTE })).not.toBeNull();

    fireEvent.click(screen.getByRole("link", { name: "Go back" }));
    const button = favouriteButtonOf(CLASSIC);
    expect(button.textContent).toBe("Remove");

    fireEvent.click(button);

    expect(ls.get("favourite websites")).toEqual([]);
  });
});

describe("saved results", () => {
  it("colours and tags a result as soon as it is saved, without moving it yet", async () => {
    await openApp("/");
    await search("burgers");
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
    await search("burgers");
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
      titles[6],
      titles[7],
    ]);
    expect(document.querySelectorAll(".result--saved")).toHaveLength(2);
  });
});

describe("My Pages", () => {
  it("removes a page from its card and shows the empty state after the last one", async () => {
    await openApp("/");
    await search("burgers");
    fireEvent.click(favouriteButtonOf(CLASSIC));
    fireEvent.click(favouriteButtonOf(SLEEP));
    fireEvent.click(screen.getByRole("link", { name: "My Pages" }));
    expect(statusText()).toBe("2 saved pages");
    const firstCard = screen
      .getByRole("link", { name: CLASSIC + NEW_TAB_NOTE })
      .closest("article");

    fireEvent.click(within(firstCard).getByRole("button", { name: "Remove" }));

    expect(statusText()).toBe("1 saved page");
    expect(ls.get("favourite websites").map((saved) => saved.title)).toEqual([SLEEP]);

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
  it("keeps the query, the results, the websites filter and the favourites after a reload", async () => {
    await openApp("/");
    await search("burgers");
    fireEvent.click(websiteCheckbox("www.citynews.com"));
    fireEvent.click(favouriteButtonOf(CLASSIC));
    cleanup();

    await openApp("/results");

    expect(screen.getByRole("textbox").value).toBe("burgers");
    expect(resultTitles()).toHaveLength(6);
    expect(resultTitles()).not.toContain(COUNCIL);
    expect(favouriteButtonOf(CLASSIC).textContent).toBe("Remove");
  });
});
