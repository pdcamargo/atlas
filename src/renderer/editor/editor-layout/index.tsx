import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorHeader } from "./header";
import { EditorSubheader } from "./subheader";
import { cn } from "@/utils";
import { editorStyles } from "@/utils/editor-styles";

export const EditorLayout = () => {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden justify-start items-start">
      <EditorHeader />
      <EditorSubheader />

      <div className="flex flex-1 w-full overflow-hidden bg-gray-100 dark:bg-gray-700 p-1">
        <Tabs
          defaultValue="account"
          className={cn("w-[400px]", editorStyles.tabs)}
        >
          <TabsList className={editorStyles.tabsList}>
            <TabsTrigger value="account" className={editorStyles.tabsTrigger}>
              Account
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account" className={editorStyles.tabsContent}>
            Make changes to your account here.
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
