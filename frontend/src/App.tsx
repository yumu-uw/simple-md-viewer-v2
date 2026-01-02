// import { Greet } from "../wailsjs/go/main/App";

import { useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";

interface Tab {
    id: string;
    title: string;
}

function App() {
    const [tabs, setTabs] = useState<Tab[]>([
        { id: "1", title: "Tab 1" },
        { id: "2", title: "Tab 2" },
    ]);
    const [selectedTab, setSelectedTab] = useState("1");
    const [nextId, setNextId] = useState(3);

    const addTab = () => {
        const newTab: Tab = {
            id: String(nextId),
            title: `Tab ${nextId}`,
        };
        setTabs([...tabs, newTab]);
        setSelectedTab(newTab.id);
        setNextId(nextId + 1);
    };

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

    return (
        <div id="App">
            <div className="flex w-full">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`flex items-center group px-2 py-2 border-t-4 ${tab.id === selectedTab ? 'border-t-blue-500' : 'border-t-transparent'}`}>
                        <Button
                            variant="ghost"
                            className="px-2 cursor-pointer hover:bg-transparent"
                            onClick={() => { setSelectedTab(tab.id) }}
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
                    </div>))}
            </div>
            {tabs.map((tab) => (
                <div key={tab.id} hidden={selectedTab !== tab.id}>
                    <TabContent tabId={tab.id} title={tab.title} />
                </div>
            ))}
        </div>
    );
}

function TabContent({ tabId, title }: { tabId: string; title: string }) {
    const [count, setCount] = useState(0);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="mb-2">Count: {count}</p>
            <Button onClick={() => setCount(count + 1)}>Increment</Button>
        </div>
    );
}

export default App;
