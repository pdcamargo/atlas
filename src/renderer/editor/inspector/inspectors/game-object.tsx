import { observer } from "mobx-react-lite";

import { SerializedObject, Undo } from "@atlas/editor";
import { GameObject } from "@atlas/engine";

import * as Properties from "../properties";
import { Field } from "./field";
import { FindComponents } from "@/editor/find-components";
import { ComponentAccordion } from "../component-accordion";

type GameObjectInspectorProps = {
  gameObject: SerializedObject<GameObject>;
};

export const GameObjectInspector = observer(
  ({ gameObject }: GameObjectInspectorProps) => {
    const name = gameObject.findProperty("name");
    const transform = gameObject.findProperty("transform");
    const components = gameObject.findProperty("components");

    const componentsChildren = components.childProperties;

    return (
      <div>
        <div className="border-b">{name.stringValue}</div>

        <div>
          <div>Transform</div>
          <div>
            <Field labelSize={9} label="position">
              <Properties.Vector2Property
                property={transform.findProperty("localPosition")}
              />
            </Field>
            <Field labelSize={9} label="scale">
              <Properties.Vector2Property
                property={transform.findProperty("localScale")}
              />
            </Field>
            <Field labelSize={9} label="rotation">
              <Properties.NumberProperty
                property={transform.findProperty("localRotation")}
              />
            </Field>
          </div>
        </div>

        <div className="w-full">
          {componentsChildren.map((component, idx) => (
            <ComponentAccordion component={component} key={idx} />
          ))}
        </div>

        <FindComponents
          onComponentSelect={(TargetComponent) => {
            Undo.addComponent(gameObject, TargetComponent);
          }}
        />
      </div>
    );
  }
);
