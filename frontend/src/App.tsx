import { useCallback, useEffect, useState } from "react";
import type { model } from "wailsjs/go/models";
import { SelectMarkdownFile } from "@/../wailsjs/go/main/App";
import { EventsOff, EventsOn } from "@/../wailsjs/runtime/runtime";
import { Button } from "@/components/shadcn/ui/button";
import TabBody from "@/components/TabBody";

interface Tab {
    id: string;
    title: string;
    mdPath: string;
}

function App() {
    const [tabs, setTabs] = useState<Tab[]>([]);
    const [selectedTab, setSelectedTab] = useState("1");
    const [nextId, setNextId] = useState(1);

    const addTab = useCallback(
        (mdInfo: model.MDInfo) => {
            const newTab: Tab = {
                id: String(nextId),
                title: mdInfo.file_name,
                mdPath: mdInfo.md_path,
            };
            setTabs((prevTabs) => [...prevTabs, newTab]);
            setSelectedTab(newTab.id);
            setNextId(nextId + 1);
            console.info("Added new tab:", mdInfo.md_path);
        },
        [nextId],
    );

    const closeTab = (tabId: string) => {
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        setTabs(newTabs);
        if (selectedTab === tabId) {
            const closedIndex = tabs.findIndex((tab) => tab.id === tabId);
            const previousIndex = closedIndex > 0 ? closedIndex - 1 : 0;
            setSelectedTab(newTabs[previousIndex].id);
        }
    };

    const handleOpenClick = async () => {
        const mdInfo = await SelectMarkdownFile();
        if (mdInfo.md_path === "") {
            return;
        }
        addTab(mdInfo);
    };

    useEffect(() => {
        EventsOn("mdfile:loaded", (mdInfo: model.MDInfo) => {
            addTab(mdInfo);
        });
        return () => {
            EventsOff("mdfile:loaded");
        };
    }, [addTab]);

    return (
        <div id="App">
            {tabs.length === 0 && (
                <div className="flex flex-col items-center justify-center h-screen gap-4">
                    <Button className="cursor-pointer" onClick={handleOpenClick}>Select Markdown File</Button>
                    <div>Or drag and drop a file into the window</div>
                </div>
            )}
            {tabs.length > 0 && (
                <div className="flex flex-col h-screen">
                    <div className="flex w-full flex-shrink-0">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`flex items-center group px-2 border-t-4 ${tab.id === selectedTab ? "border-t-blue-500" : "border-t-transparent"}`}
                            >
                                <Button
                                    variant="ghost"
                                    className="px-2 cursor-pointer hover:bg-transparent"
                                    onClick={() => {
                                        setSelectedTab(tab.id);
                                    }}
                                >
                                    {tab.title}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        closeTab(tab.id);
                                    }}
                                    className={`px-0 cursor-pointer border-none hover:bg-transparent text-lg`}
                                >
                                    ×
                                </Button>
                            </div>
                        ))}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                hidden={selectedTab !== tab.id}
                                className="h-full"
                            >
                                <TabBody mdPath={tab.mdPath} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
