type Model = {
  name: string;
  properties: Array<Property>;
};

type Property = {
  name: string;
  type: any;
  funct?: string;
  fields?: string;
  references?: string;
  defaultValue?: string;
}

type PropertyType = {
  value: string;
  label: string;
}

export type {
  Model,
  Property,
  PropertyType
}
