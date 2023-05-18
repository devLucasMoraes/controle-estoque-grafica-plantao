import { ToolsList } from '../../shared/components';
import { LayoutBaseDaPagina } from '../../shared/layouts';

export const Dashboard = () => {

    return (
        <LayoutBaseDaPagina
            titulo='Dashboard'
            tools={<ToolsList />}
        >
            testando
        </LayoutBaseDaPagina>
    );
};