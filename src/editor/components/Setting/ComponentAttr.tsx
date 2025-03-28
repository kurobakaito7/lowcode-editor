import { Form, Input, Select } from "antd";
import { useComponentsStore } from "../../stores/components";
import { ComponentConfig, ComponentSetter, useComponentConfigStore } from "../../stores/component-config";
import { useEffect } from "react";

export function ComponentAttr() {
    const [form] = Form.useForm();
    const { curComponentId, curComponent, updateComponentProps } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();

    // useEffect(() => {
    //     const data = form.getFieldsValue();
    //     form.setFieldsValue({ ...data, ...curComponent?.props });
    // }, [curComponent]);

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({...curComponent?.props});
    }, [curComponent, form]);

    if (!curComponentId || !curComponent) return null;

    function renderFormElement(setter: ComponentSetter) {
        const { type, options } = setter;

        if (type === 'select') {
            return <Select options={options} />
        } else if (type === 'input') {
            return <Input />
        }
    }

    function valueChange(changeValues: ComponentConfig) {
        if (curComponentId) {
            updateComponentProps(curComponentId, changeValues);
        }
    }

    return (
        <Form
            form={form}
            onValuesChange={valueChange}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 14 }}
        >
            <Form.Item label="组件id">
                <Input value={curComponent.id} disabled />
            </Form.Item>
            <Form.Item label="组件名称">
                <Input value={curComponent.name} disabled />
            </Form.Item>
            <Form.Item label="组件描述">
                <Input value={curComponent.desc} disabled />
            </Form.Item>
            {
                componentConfig[curComponent.name]?.setter?.map(setter => (
                    <Form.Item key={setter.name} label={setter.label} name={setter.name}>
                        {renderFormElement(setter)}
                    </Form.Item>
                ))
            }
        </Form>
    )
}