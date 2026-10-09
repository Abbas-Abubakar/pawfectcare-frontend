import { createContext, useContext, useState, type ReactNode } from 'react';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within <Tabs>.');
  }
  return context;
};

interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

const TabsRoot = ({ defaultTab, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
};

const TabsList = ({ children }: { children: ReactNode }) => (
  <div className="flex gap-2 overflow-x-auto shadow-[inset_0_-2px_0_0_rgb(58_46_38/0.05)] [scrollbar:none] [&::-webkit-scrollbar]:hidden">
    {children}
  </div>
);

const TabsTab = ({ id, children }: { id: string; children: ReactNode }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  return (
     <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`shrink-0 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
        isActive ? 'border-coral text-coral' : 'border-transparent text-ink/50 hover:text-ink'
      }`}
    >
      {children}
    </button>
  );
};

const TabsPanel = ({ id, children }: { id: string; children: ReactNode }) => {
  const { activeTab } = useTabsContext();
  if (activeTab !== id) return null;
  return <div className="pt-6">{children}</div>;
};

// Attach sub-components to the root, so consumers import just `Tabs`
// and access the rest as Tabs.List, Tabs.Tab, Tabs.Panel.
export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});