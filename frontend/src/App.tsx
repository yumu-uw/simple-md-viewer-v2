import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { EventsOff, EventsOn } from "../wailsjs/runtime/runtime";
import TabBody from "./components/TabBody";

interface Tab {
    id: string;
    title: string;
    mdPath: string;
}

function App() {
    const [tabs, setTabs] = useState<Tab[]>([
        {
            id: "1",
            title: "README.md",
            mdPath: "/Volumes/DataStore/repos/simple-md-viewer/README.md",
        },
        { id: "2", title: "Tab 2", mdPath: "" },
    ]);
    const [selectedTab, setSelectedTab] = useState("1");
    const [nextId, setNextId] = useState(3);

    const addTab = useCallback((mdPath: string) => {
        const newTab: Tab = {
            id: String(nextId),
            title: `Tab ${nextId}`,
            mdPath: mdPath,
        };
        setTabs((prevTabs) => [...prevTabs, newTab]);
        setSelectedTab(newTab.id);
        setNextId(nextId + 1);
        console.info("Added new tab:", mdPath);
    }, [nextId]);

    const closeTab = (tabId: string) => {
        const newTabs = tabs.filter((tab) => tab.id !== tabId);
        if (newTabs.length === 0) {
            return;
        }
        setTabs(newTabs);
        if (selectedTab === tabId) {
            const closedIndex = tabs.findIndex((tab) => tab.id === tabId);
            const previousIndex = closedIndex > 0 ? closedIndex - 1 : 0;
            setSelectedTab(newTabs[previousIndex].id);
        }
    };

    useEffect(() => {
        EventsOn("mdfile:loaded", (mdPath: string) => {
            addTab(mdPath);
        });
        return () => {
            EventsOff("mdfile:loaded");
        };
    }, [addTab]);

    return (
        <div id="App">
            <div className="flex w-full">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`flex items-center group px-2 py-2 border-t-4 ${tab.id === selectedTab ? "border-t-blue-500" : "border-t-transparent"}`}
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
            {tabs.map((tab) => (
                <div key={tab.id} hidden={selectedTab !== tab.id}>
                    <TabBody mdPath={tab.mdPath} />
                </div>
            ))}
        </div>
    );
}

export default App;
