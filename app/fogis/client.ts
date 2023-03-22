import { CookieJar, JSDOM } from "jsdom";
import { parseGamesFromTableRows } from "./parseGamesFromTableRows";

export class FogisClient {
  private username: string;
  private password: string;
  private cookieJar = new CookieJar();

  constructor({ auth }: { auth: { username: string; password: string } }) {
    this.username = auth.username;
    this.password = auth.password;
  }

  private async fetch(url: string, options: RequestInit = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        cookie: await this.cookieJar.getCookieString(url),
      },
    });
    const cookies = res.headers.get("set-cookie");
    if (cookies) {
      await this.cookieJar.setCookie(cookies, url);
    }
    return res;
  }

  async login() {
    const loginScreenRes = await this.fetch(
      "https://fogis.svenskfotboll.se/Fogisdomarklient/Login/Login.aspx"
    );
    const loginScreenDom = new JSDOM(await loginScreenRes.text());
    const formData = new URLSearchParams();
    formData.append(
      "__VIEWSTATE",
      getFieldValue(loginScreenDom, "__VIEWSTATE")
    );
    formData.append(
      "__VIEWSTATEGENERATOR",
      getFieldValue(loginScreenDom, "__VIEWSTATEGENERATOR")
    );
    formData.append(
      "__EVENTVALIDATION",
      getFieldValue(loginScreenDom, "__EVENTVALIDATION")
    );
    formData.append("tbAnvandarnamn", this.username);
    formData.append("tbLosenord", this.password);
    formData.append("btnLoggaIn", "Logga in");

    await this.fetch(
      "https://fogis.svenskfotboll.se/Fogisdomarklient/Login/Login.aspx",
      { method: "POST", body: formData }
    );
  }

  async getGames() {
    await this.cookieJar.setCookie(
      "Domare_anvandarinstallning=-494996967=False;",
      "https://fogis.svenskfotboll.se/Fogisdomarklient/Uppdrag/UppdragUppdragLista.aspx"
    );
    const res = await this.fetch(
      "https://fogis.svenskfotboll.se/Fogisdomarklient/Uppdrag/UppdragUppdragLista.aspx",
      { method: "GET", redirect: "manual" }
    );
    const dom = new JSDOM(await res.text());
    const rows = dom.window.document.querySelectorAll(
      "table.fogisInfoTable tbody tr"
    );

    return parseGamesFromTableRows(rows);
  }
}

function getFieldValue(dom: JSDOM, name: string) {
  const element = dom.window.document.querySelector(`[name="${name}"]`);
  if (!element) {
    throw new Error(`Could not get field with name ${name}`);
  }
  const value = (element as HTMLInputElement).value;
  return value;
}
