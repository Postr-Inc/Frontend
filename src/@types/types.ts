export interface Props{
    setParams: (params: any) => void | any;
    params: any;
    lastPage: any;
    swapPage: (page: any) => void | any;
    setLastPage: (page: any) => void | any; 
    currentPage: any;
    [key: string]: any;
}