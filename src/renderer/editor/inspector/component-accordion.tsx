import { SerializedProperty, toTitleCase } from "@atlas/editor";
import { observer } from "mobx-react-lite";
import { Field } from "./inspectors/field";
import { PropertyRenderer } from "./properties/property-renderer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type ComponentAccordionProps = {
  component: SerializedProperty;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ComponentAccordion: React.FC<ComponentAccordionProps> = observer(
  ({ component, defaultOpen, onOpenChange }) => {
    return (
      <Collapsible
        className="component-accordion"
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <CollapsibleTrigger className="component-accordion-header">
          {toTitleCase(component.findProperty("name").stringValue)}
        </CollapsibleTrigger>
        <CollapsibleContent className="component-accordion-content">
          {component.hasChildren &&
            component.childProperties
              .filter(
                (p) =>
                  !["id", "game object"].includes(p.displayName.toLowerCase())
              )
              .map((child) => (
                <Field
                  key={child.path}
                  label={child.displayName}
                  labelSize={component.largestChildDisplayNameLength}
                >
                  <PropertyRenderer property={child} />
                </Field>
              ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

export { ComponentAccordion };
