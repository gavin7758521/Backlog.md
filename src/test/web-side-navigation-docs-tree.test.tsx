import { afterEach, describe, expect, it } from "bun:test";
import { JSDOM } from "jsdom";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import type { Document as BacklogDocument } from "../types/index.ts";
import SideNavigation from "../web/components/SideNavigation.tsx";

const createDocument = (overrides: Partial<BacklogDocument>): BacklogDocument => ({
	id: "doc-1",
	title: "Document",
	type: "guide",
	createdDate: "2026-01-01",
	rawContent: "",
	...overrides,
});

let activeRoot: Root | null = null;
const originalFetch = globalThis.fetch;

const setupDom = () => {
	const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "http://localhost" });
	(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
	globalThis.window = dom.window as unknown as Window & typeof globalThis;
	globalThis.document = dom.window.document as unknown as Document;
	globalThis.navigator = dom.window.navigator as unknown as Navigator;
	globalThis.localStorage = dom.window.localStorage as unknown as Storage;
	globalThis.fetch = (async () =>
		({
			ok: true,
			json: async () => ({ version: "test" }),
		}) as Response) as typeof fetch;
};

const renderSideNavigation = (docs: BacklogDocument[]): HTMLElement => {
	setupDom();
	const container = document.getElementById("root");
	expect(container).toBeTruthy();
	activeRoot = createRoot(container as HTMLElement);
	act(() => {
		activeRoot?.render(
			<MemoryRouter>
				<SideNavigation
					tasks={[]}
					docs={docs}
					decisions={[]}
					isLoading={false}
					onRefreshData={async () => {}}
				/>
			</MemoryRouter>,
		);
	});
	return container as HTMLElement;
};

afterEach(() => {
	globalThis.fetch = originalFetch;
	if (activeRoot) {
		act(() => {
			activeRoot?.unmount();
		});
		activeRoot = null;
	}
});

describe("SideNavigation Documents tree", () => {
	it("renders nested document paths as visible folder groups", () => {
		const container = renderSideNavigation([
			createDocument({
				id: "doc-1",
				title: "Setup",
				path: "guides/setup/doc-1 - Setup.md",
			}),
			createDocument({
				id: "doc-2",
				title: "Packaging",
				path: "guides/packaging/doc-2 - Packaging.md",
			}),
			createDocument({
				id: "doc-3",
				title: "Phase 1 Handoff",
				path: "handoff/phase-1/doc-3 - Phase-1-Handoff.md",
			}),
			createDocument({
				id: "doc-4",
				title: "Root Doc",
				path: "doc-4 - Root-Doc.md",
			}),
		]);

		const guidesButton = container.querySelector("button[aria-label='guides folder']");
		const setupButton = container.querySelector("button[aria-label='setup folder']");
		const guidesGroup = container.querySelector("[role='group'][aria-label='guides contents']");
		const setupGroup = container.querySelector("[role='group'][aria-label='setup contents']");

		expect(guidesButton?.getAttribute("aria-expanded")).toBe("true");
		expect(setupButton?.getAttribute("aria-expanded")).toBe("true");
		expect(guidesGroup).toBeTruthy();
		expect(setupGroup).toBeTruthy();
		expect(setupGroup?.querySelector("a[href='/documentation/1/setup']")).toBeTruthy();
		expect(guidesGroup?.querySelector("a[href='/documentation/2/packaging']")).toBeTruthy();
		expect(container.querySelector("button[aria-label='phase-1 folder']")).toBeTruthy();
		expect(container.querySelector("a[href='/documentation/4/root-doc']")).toBeTruthy();
	});
});
