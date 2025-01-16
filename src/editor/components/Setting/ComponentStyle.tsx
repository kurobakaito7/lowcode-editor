import { Form, Input, InputNumber, Select } from "antd";
import { ComponentSetter, useComponentConfigStore } from "../../stores/component-config";
import { useComponentsStore } from "../../stores/components";
import { CSSProperties, useEffect, useState } from "react";
import CssEditor from "./CssEditor";
import { debounce } from "lodash-es";
import StyleToObject from "style-to-object";

export function ComponentStyle() {
    const [form] = Form.useForm();

    const { curComponentId, curComponent, updateComponentStyles } = useComponentsStore();
    const { componentConfig } = useComponentConfigStore();
    const [css, setCss] = useState<string>(`.comp{\n\n}`);

    useEffect(() => {
        // 切换组件 清空表单
        form.resetFields();

        const data = form.getFieldsValue();
        form.setFieldsValue({ ...data, ...curComponent?.styles });

        setCss(toCSSStr(curComponent?.styles))
    }, [curComponent])

    function toCSSStr(css: Record<string, any> | undefined) {
        let str = `.comp {\n`;
        for (const key in css) {
            let value = css[key];
            if (!value) {
                continue;
            }
            if (['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
                value += 'px';
            }

            str += `\t${key}: ${value};\n`
        }
        str += `}`;
        return str;
    }

    if (!curComponentId || !curComponent) return null;

    function renderFormElement(stylesSetter: ComponentSetter) {
        const { type, options } = stylesSetter;
        if (type === 'select') {
            return <Select options={options} />
        } else if (type === 'input') {
            return < Input />
        } else if (type === 'inputNumber') {
            return <InputNumber />
        }
    }

    function valueChange(changeValues: CSSProperties) {
        if (curComponentId) {
            updateComponentStyles(curComponentId, changeValues);
        }
    }

    const handleEditorChange = debounce((value) => {
        setCss(value);

        const css: Record<string, any> = {};

        try {
            const cssStr = value.replace(/\/\*.*\*\//, '').replace(/(\.?[^{]+{)/, '').replace('}', '');

            StyleToObject(cssStr, (name, value) => {
                css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
            });
            console.log(css);
            updateComponentStyles(curComponentId, { ...form.getFieldsValue(), ...css }, true);
        } catch (error) {
            console.log(error);
        }
    }, 500);

    return (
        <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            onValuesChange={valueChange}
        >
            {componentConfig[curComponent.name].stylesSetter?.map(setter => (
                <Form.Item key={setter.name} label={setter.label} name={setter.name}>
                    {renderFormElement(setter)}
                </Form.Item>
            ))}
            <div className='h-[200px] border-[1px] border-[#ccc]'>
                <CssEditor value={css} onChange={handleEditorChange} />
            </div>
        </Form>
    )
}