import { Model, Property, PropertyType } from '../../types';
import './NewModel.css';

import { ReactNode, useState } from 'react';
import { Button, Card, Input, Select, Space, Checkbox, Form, Radio } from 'antd';

const initProperty: Property = {
  name: '',
  type: '',
  funct: '',
}

interface NewModelProps {
  model: Model;
  setModel(modelUpdated: Model): void;
  title: ReactNode;
  children: ReactNode;
  position: number;
  listTypes: Array<PropertyType>
}

const NewModel = ({ model, setModel, title, children, position, listTypes }: NewModelProps) => {

  const addNewProperty = () => {
    const newProperty = initProperty;
    setModel({
      name: model.name,
      properties: [...model.properties, newProperty]
    })
  };
  // Add params to differents functions
  const addFunctToProperty = (newFunct: string, position: number) => {
    let updatedFunct = model.properties[position]?.funct;
    if (updatedFunct) {
      if (updatedFunct.includes(newFunct)) {
        updatedFunct = updatedFunct.replace(newFunct, "");
      } else {
        updatedFunct += newFunct;
      }
    } else {
      updatedFunct = newFunct;
    }
    if (updatedFunct) {
      updatedFunct = updatedFunct.replaceAll("@", " @");
    }
    setModel({ name: model.name, properties: updateProperties('funct', updatedFunct, position) });
  };

  const updateProperties = (field: string, newValue: string, position: number) => {
    const updatedProperties = model.properties.map((property, index) => {
      if (index === position) {
        return {
          ...property,
          [field]: newValue
        }
      } else {
        return property;
      }
    })
    return updatedProperties;
  };

  const defaultValueSelection = (index: number, property: Property) => {
    return (
      <>
        <label>Params for @default function</label>
        <Form.Item
          label="Auto increment?"
          name={`@default-value-${position}-${index}`}
        >
          <Radio.Group onChange={(e) => setModel({ name: model.name, properties: updateProperties('defaultValue', e.target.value, index) })} value={property.defaultValue}>
            <Radio value="autoincrement()">Yes</Radio>
            <Radio value="">No</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Specific value:"
          name={`@default-value-${position}-${index}`}
        >
          <Input disabled={property.defaultValue === 'autoincrement()'} placeholder='Value' onChange={({ currentTarget }) => setModel({ name: model.name, properties: updateProperties('defaultValue', currentTarget.value, index) })} value={property.defaultValue} />
        </Form.Item>
      </>
    )
  };

  const addRelationParams = (index: number, property: Property) => {
    return (
      <>
        <label>Params for @relation function</label>
        <Form.Item
          label="Fields"
          name={`fields-${position}-${index}`}
          rules={[{ required: true, message: 'Please fill the inputs' }]}
        >
          <Input placeholder='Fields' onChange={({ currentTarget }) => setModel({ name: model.name, properties: updateProperties('fields', currentTarget.value, index) })} value={property.fields} />
        </Form.Item>
        <Form.Item
          label="References"
          name={`references-${position}-${index}`}
          rules={[{ required: true, message: 'Please fill the inputs' }]}
        >
          <Input placeholder='References' onChange={({ currentTarget }) => setModel({ name: model.name, properties: updateProperties('references', currentTarget.value, index) })} value={property.references} />
        </Form.Item>
      </>
    )
  };

  return (
    <Card className='card-styled' title={title}>
      {model.properties.length > 0 && model.properties.map((property, index) =>
        <div key={index}>
          <Form.Item
            label="Name"
            name={`name-${position}-${index}`}
            rules={[{ required: true, message: 'Please input a name!' }]}
          >
            <Input placeholder='Property Name' value={property.name} onChange={(e) => setModel({ name: model.name, properties: updateProperties('name', e.currentTarget.value, index) })} />
          </Form.Item>

          <Form.Item
            label="Type"
            name={`type-${position}-${index}`}
            rules={[{ required: true, message: 'Please input a type!' }]}
          >
            <Select
              placeholder="Select a type"
              optionFilterProp="children"
              options={listTypes}
              onChange={(value) => setModel({ name: model.name, properties: updateProperties('type', value, index) })}
            />
          </Form.Item>

          <Form.Item
            label="Functions"
            name={`functions-${position}-${index}`}
          >
            <Space direction="vertical">
              <Checkbox onChange={(e) => addFunctToProperty(e.target.value, index)} value="@id">@id</Checkbox>
              <Checkbox onChange={(e) => addFunctToProperty(e.target.value, index)} value="@relation(fields: ['fieldsParam'], references: ['referencesParam'])">@relation</Checkbox>
              <Checkbox onChange={(e) => addFunctToProperty(e.target.value, index)} value="@unique">@unique</Checkbox>
              <Checkbox onChange={(e) => addFunctToProperty(e.target.value, index)} value="@default('defaultParam')">@default</Checkbox>
              <Checkbox onChange={(e) => addFunctToProperty(e.target.value, index)} value="@updatedAt">@updatedAt</Checkbox>
            </Space>
          </Form.Item>
          {property.funct?.includes("@relation") && addRelationParams(index, property)}
          {property.funct?.includes("@default") && defaultValueSelection(index, property)}
          <hr />
        </div>
      )
      }
      <div className='card-buttons-container'>
        <Button type="primary" onClick={addNewProperty}>Add Property</Button>
        {children}
      </div>
    </Card >
  )
}

export default NewModel;
