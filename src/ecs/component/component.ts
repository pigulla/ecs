import type { Class, Opaque } from 'type-fest'

export type ComponentType = Opaque<string, 'component-type'>

export function isComponentType(value: string): value is ComponentType {
    return value.startsWith('📦')
}

export abstract class Component {
    public getType(): ComponentType {
        return Component.typeOf(this)
    }

    public static typeOf<T extends Component>(
        component: ComponentType | T | Class<T>,
    ): ComponentType {
        if (typeof component === 'string') {
            return component
        }

        const className =
            component instanceof Component ? component.constructor.name : component.name

        return `📦${className}` as ComponentType
    }
}
