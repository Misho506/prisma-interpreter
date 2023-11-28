import { Button, Form, Input } from "antd";
import NewModel from "../NewModel/NewModel";
import { Model, PropertyType } from "../../types";
import { useState } from "react";
import "./ModelList.css"
const initialModelValues: Model = {
  name: '',
  properties: []
}

const initListTypes: Array<PropertyType> = [
  {
    value: 'Int',
    label: 'Int',
  },
  {
    value: 'String',
    label: 'String',
  },
  {
    value: 'Boolean',
    label: 'Boolean',
  },
  {
    value: 'DateTime',
    label: 'DateTime',
  },
];

const ModelList = () => {
  const [modelList, setModelList] = useState<Array<Model>>([initialModelValues]);

  const generateString = () => {
    let finalString = '';
    modelList.forEach((model, i) => {
      let modelToString: string = `model ${model.name} {\n`;
      model.properties.forEach((property, index) => {
        const { name, type, funct, fields, references, defaultValue } = property;
        let updatedFunctString = funct;
        // Add fields and references
        if (updatedFunctString?.includes('@relation')) {
          updatedFunctString = addRelationParams(funct as string, fields as string, references as string);
        }
        if (updatedFunctString?.includes('@default')) {
          updatedFunctString = addDefaultParams(funct as string, defaultValue as string);
        }
        const propertyString = " " + `${name} ${type}${!!updatedFunctString ? updatedFunctString : ''}`.replace(/\s+/g, " ").trim()
        modelToString += propertyString + `${index + 1 < model.properties.length ? '\n' : ''}`;
      })
      modelToString += "\n}"
      finalString += (i < modelList.length ? '\n' : '') + modelToString;
    });
    alert(finalString);
  };

  const addRelationParams = (funct: string, fields: string, references: string) => {
    let updatedString = (funct as string).replace(`'fieldsParam'`, fields);
    updatedString = updatedString.replace(`'referencesParam'`, references)
    return updatedString;
  }

  const addDefaultParams = (funct: string, defaultValue: string) => {
    let updatedString = (funct as string).replace(`'defaultParam'`, defaultValue);
    return updatedString;
  }


  const setModelTitle = (newName: string) => {
    if (newName.length === 1) {
      newName = newName.toUpperCase();
    }
    return newName
  }

  const deleteModel = (position: number) => {
    modelList.splice(position, 1);
    const updatedList = [...modelList]
    setModelList(updatedList)
  }

  const setModel = (modelUpdated: Model, position: number) => {
    const updatedList = modelList.map((model, index) => {
      return position === index ? modelUpdated : model
    });
    setModelList(updatedList)
  }

  const NewModelTitle = (model: Model, position: number) => {
    return (
      <Form.Item
        style={{ marginTop: 5 }}
        rules={[{ required: true, message: 'Please input a model name!' }]}
      >
        <Input placeholder='Model Name' value={model.name as string} onChange={(e) => setModel({ name: setModelTitle(e.currentTarget.value), properties: model.properties }, position)} />
      </Form.Item>
    )
  };

  const newListType = [...initListTypes, ...modelList.map((model) => ({ value: model.name, label: model.name }))]

  return (
    <div className='card-list'>
      <Form onFinish={generateString}>
        <div className="card-container">
          {modelList.map((model, index) =>
            <NewModel listTypes={newListType} key={index} position={index} model={model} setModel={(modelUpdated) => setModel(modelUpdated, index)} title={NewModelTitle(model, index)} children={<Button disabled={modelList.length === 1} type="primary" danger onClick={() => deleteModel(index)}>Delete Model</Button>} />
          )}
        </div>
        <div className="buttons-container">
          <Button onClick={() => setModelList([...modelList, initialModelValues])}>Add New Model</Button>
          <Button type="primary" htmlType="submit">Generate String</Button>
        </div>
      </Form>
    </div>
  )
}

export default ModelList;
