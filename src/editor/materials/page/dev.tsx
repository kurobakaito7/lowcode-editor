import { CommonComponentProps } from "../../interface";
import { useMaterialDrop } from "../../hooks/useMaterialDrop";

function Page({ id, children, styles }: CommonComponentProps) {

    const { canDrop, drop } = useMaterialDrop(['Button', 'Container', 'Modal', 'Table', 'Form'], id);

    return (
        <div
            data-component-id={id}
            ref={drop}
            className='p-[20px] h-[100%] box-border'
            style={{ ...styles, border: canDrop ? '2px solid blue' : 'none' }}
        >
            {children}
        </div>
    )
}

export default Page;