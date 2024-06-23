export interface Props{
    setParams: (params: any) => void;
    params: any;
    lastPage: any;
    swapPage: (page: any) => void;
    setLastPage: (page: any) => void; 
    currentPage: any;
}