import { useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';
import { CommonComponentProps } from '../../interface';

const Container = ({ id, name, children, styles }: CommonComponentProps) => {

    const { canDrop, drop } = useMaterialDrop(['Button', 'Container', 'Modal', 'Table', 'Form'], id);

    const divRef = useRef<HTMLDivElement>(null);

    const [_, drag] = useDrag({
        type: name,
        item: {
            type: name,
            dragType: 'move',
            id
        }
    });

    useEffect(() => {
        drop(divRef);
        drag(divRef)
    }, [])

    return (
        <div
            data-component-id={id}
            ref={divRef}
            style={styles}
            className={`min-h-[100px] p-[20px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px] border-[#000]'}`}
        >{children}</div>
    )
}

export default Container;