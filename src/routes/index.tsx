import { NavigationContainer } from '@react-navigation/native';
import { MenuRoutes } from './menu.routes'

export function Routes() {
    return (
        <NavigationContainer>
            <MenuRoutes/>
        </NavigationContainer>
    )
}