import { ToolsList } from '../../shared/components';
import { LayoutBaseDePagina } from '../../shared/layouts';

export const Dashboard = () => {

    return (
        <LayoutBaseDePagina
            titulo='Dashboard'
            toolsList={<ToolsList />}
        >
            testando
        </LayoutBaseDePagina>
    );
};