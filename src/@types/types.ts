export interface Props{
    setParams: (params: any) => void | any;
    params:  { [key: string]: any };
    lastPage: any;
    swapPage: (page: any) => void | any;
    setLastPage: (page: any) => void | any; 
    currentPage: any;
    changePage: (page: any) => void | any;
    goBack: () => void | any;
    [key: string]: any;
}