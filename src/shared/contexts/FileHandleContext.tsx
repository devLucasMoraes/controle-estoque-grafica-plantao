import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { IDetalhamentoTransacoesEntrada, IItemTransacaoEntrada } from '../services/api/transacoesEntrada/TransacoesEntradaService';
import { FornecedorasService, IFornecedorasFormData } from '../services/api/fornecedoras/FornecedorasService';
import { ITransportadoraFormData, TransportadorasService } from '../services/api/transportadoras/TransportadorasService';
import { XMLParser } from 'fast-xml-parser';
import { INfeProc } from '../interfaces';
import { MateriaisService } from '../services/api/materiais/MateriaisService';

interface IFileHandlerContextData {
    fileData?: IDetalhamentoTransacoesEntrada;
    fornecedoraFileData?: Omit<IFornecedorasFormData, 'id'>;
    transportadoraFileData?: Omit<ITransportadoraFormData, 'id'>;
    fileInputRef: React.RefObject<HTMLInputElement>;
    showNovaFornecedoraDialog: boolean;
    showNovaTransportadoraDialog: boolean;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    setShowNovaFornecedoraDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setShowNovaTransportadoraDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const FileHandleContext = createContext({} as IFileHandlerContextData);

export const useFileHandleContext = () => {
    return useContext(FileHandleContext);
};

interface IFileHandlerProviderProps {
    children: React.ReactNode;
}

export const FileHandlerProvider = ({ children }: IFileHandlerProviderProps) => {
    console.log('renderiou FileHandlerProvider');

    const [fileData, setFileData] = useState<IDetalhamentoTransacoesEntrada>();
    const [fornecedoraFileData, setFornecedoraFileData] = useState<Omit<IFornecedorasFormData, 'id'>>();
    const [transportadoraFileData, setTransportadoraFileData] = useState<Omit<ITransportadoraFormData, 'id'>>();
    const [showNovaFornecedoraDialog, setShowNovaFornecedoraDialog] = useState(false);
    const [showNovaTransportadoraDialog, setShowNovaTransportadoraDialog] = useState(false);


    const fileInputRef = useRef<HTMLInputElement>(null);



    const getMaterialNfeId = async (codProd: string): Promise<number | undefined> => {
        try {
            const result = await MateriaisService.getByCodProd(codProd);
            console.log(codProd);
            if (result instanceof Error) {
                console.error(result.message);
            } else {
                return result.id;
            }
        } catch (error) {
            alert('Aconteceu um erro desconhecido');
            throw error;
        }
    };

    const getFornecedoraNfeId = async (cnpj: string): Promise<number | undefined> => {
        try {
            const result = await FornecedorasService.getByCNPJ(cnpj);
            console.log(cnpj);
            if (result instanceof Error) {
                setShowNovaFornecedoraDialog(true);
            } else {
                return result.id;
            }
        } catch (error) {
            alert('Aconteceu um erro desconhecido');
            throw error;
        }
    };

    const getTransportadoraNfeId = async (cnpj: string): Promise<number | undefined> => {
        try {
            const result = await TransportadorasService.getByCNPJ(cnpj);
            console.log(cnpj);
            if (result instanceof Error) {
                setShowNovaTransportadoraDialog(true);
            } else {
                return result.id;
            }
        } catch (error) {
            alert('Aconteceu um erro desconhecido');
            throw error;
        }
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const parser = new XMLParser({
            numberParseOptions: {
                eNotation: false,
                leadingZeros: false,
                hex: false
            }
        });

        const reader = new FileReader();
        reader.onload = async () => {
            const fileContent = reader.result?.toString() ?? '';
            const jsonObj: INfeProc = parser.parse(fileContent);

            const chaveNfe = jsonObj.nfeProc.protNFe.infProt.chNFe;
            const dataEmissaoNfe = jsonObj.nfeProc.NFe.infNFe.ide.dhEmi;
            const fornecedoraNfe = jsonObj.nfeProc.NFe.infNFe.emit;
            const transportadoraNfe = jsonObj.nfeProc.NFe.infNFe.transp.transporta;
            const itensNfe = jsonObj.nfeProc.NFe.infNFe.det;
            const totaisNfe = jsonObj.nfeProc.NFe.infNFe.total;

            const transportadoraImportData: Omit<IFornecedorasFormData, 'id'> = {
                cnpj: transportadoraNfe.CNPJ,
                nomeFantasia: '',
                razaoSocial: transportadoraNfe.xNome,
                fone: ''
            };
            setTransportadoraFileData(transportadoraImportData);
            
            const fornecedoraImportData: Omit<IFornecedorasFormData, 'id'> = {
                cnpj: fornecedoraNfe.CNPJ,
                nomeFantasia: fornecedoraNfe.xFant,
                razaoSocial: fornecedoraNfe.xNome,
                fone: fornecedoraNfe.enderEmit.fone.toString()
            };
            setFornecedoraFileData(fornecedoraImportData);

            


            const idTransportadora = await getTransportadoraNfeId(transportadoraNfe.CNPJ);


            const idFornecedora = await getFornecedoraNfeId(fornecedoraNfe.CNPJ);

            const itensPromises = itensNfe.map(async (item) => (
                {
                    id: Math.random(),
                    xProd: item.prod.xProd,
                    qtdeEstoque: 0,
                    idMaterial: await getMaterialNfeId(item.prod.cProd),
                    undCom: item.prod.uCom,
                    quantCom: item.prod.qCom,
                    valorUntCom: item.prod.vUnCom,
                    valorIpi: item.imposto.IPI.IPITrib?.vIPI ?? 0
                }
            ));
            
            const itensResolve: IItemTransacaoEntrada[] = await Promise.all(itensPromises); 

            const xmlImportData: IDetalhamentoTransacoesEntrada = {
                id: Math.random(),
                nfe: chaveNfe,
                dataEmissao: dataEmissaoNfe,
                dataRecebimento: '',
                valorTotal: totaisNfe.ICMSTot.vNF,
                valorFrete: totaisNfe.ICMSTot.vFrete,
                valorIpiTotal: totaisNfe.ICMSTot.vIPI,
                obs: '',
                idTransportadora: idTransportadora,
                idFornecedora: idFornecedora,
                itens: itensResolve
            };

            

            setFileData(xmlImportData);
        };
        reader.readAsText(file);
    };

    const contextValue: IFileHandlerContextData = {
        fileData,
        fornecedoraFileData,
        transportadoraFileData,
        fileInputRef,
        showNovaFornecedoraDialog,
        showNovaTransportadoraDialog,
        setShowNovaFornecedoraDialog,
        setShowNovaTransportadoraDialog,
        handleFileChange,
    };


    useEffect(() => {
        const fileInput = fileInputRef.current;
        if (fileInput) {
            const handleChange = (e: Event) => {
                handleFileChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
            };
            fileInput.addEventListener('change', handleChange);
            return () => {
                fileInput.removeEventListener('change', handleChange);
            };
        }
    }, []);

    return (
        <FileHandleContext.Provider value={contextValue}>
            {children}
        </FileHandleContext.Provider>
    );
};