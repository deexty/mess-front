import { IOrderers, IParseFilter } from "../interfaces/parse-filters";

/**
 * Função que transforma filtros e parâmetros de ordenação em uma query string.
 * @param filters - Lista de filtros a serem aplicados.
 * @param orderer - Parâmetros de ordenação. (Opcional)
 * @param page - Número da página.
 * @param per_page - Número de itens por página.
 * @returns A query string gerada com base nos filtros e ordenação fornecidos.
 */
export const parseFilters = (
    filters: IParseFilter[] = [],
    orderers?: IOrderers,
    page?: number,
    per_page?: number
): string => {
    const filtersByMapped = filters.map(filter => filter.filterBy).join(",");
    const filtersValueMapped = filters
        .map(filter => filter.filterValue)
        .join(",");
    const filtersTypeMapped = filters.map(filter => filter.filterType).join(",");

    let parsedQuery = "";

    if (page && per_page) {
        parsedQuery += `?page=${page}&per_page=${per_page}`;
    }

    if (filters.length > 0) {
        parsedQuery += `${parsedQuery.length > 0 ? "&" : "?"}filterBy=${filtersByMapped}&filterValue=${filtersValueMapped}&filterType=${filtersTypeMapped}`;
    }

    if (orderers?.orderBy) {
        parsedQuery += `${parsedQuery.length > 0 ? "&" : "?"}orderBy=${orderers.orderBy}&orderType=${orderers.orderType || "ASC"}`;
    }

    return parsedQuery;
};
