import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Project } from "@atlas/editor/project";
import { Dialog } from "@atlas/editor/dialog";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  path: z.string().min(2, {
    message: "Project path must be at least 2 characters.",
  }),
  template: z.string().optional(),
});

type ProjectCreateFormProps = {
  onProjectCreate: (project: Project) => void;
};

export const ProjectCreateForm = ({
  onProjectCreate,
}: ProjectCreateFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Atlas Demo",
      path: "/Users/patrickdiascamargo/atlas",
      template: "empty",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const createProject = await Project.createProject({
      name: values.name,
      path: values.path,
    });

    if (createProject.error) {
      console.error(createProject.error);
      return;
    }

    const openedProject = await Project.openProject(values.path);

    if (!openedProject) {
      console.error("Failed to open project.");
      return;
    }

    onProjectCreate(openedProject);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project name</FormLabel>
              <FormControl>
                <Input placeholder="Project Name" {...field} />
              </FormControl>
              <FormDescription>Name to identify the project.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project path</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Project Path"
                  readOnly
                  onClick={() => {
                    Dialog.openDirectory({ title: "Select project path" }).then(
                      (path) => {
                        if (path) {
                          form.setValue(
                            "path",
                            `${path}/${form.getValues().name}`
                          );
                        }
                      }
                    );
                  }}
                />
              </FormControl>
              <FormDescription>Path to the project directory.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project template</FormLabel>
              <FormControl>
                <Input placeholder="Project Template" {...field} />
              </FormControl>
              <FormDescription>
                Template to use for the project.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
