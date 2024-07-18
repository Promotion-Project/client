import React from 'react';
import { Promotion } from '../types/promotion';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TablePagination, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';

interface PromotionTableProps {
  promotions: Promotion[];
  onEdit: (promotion: Promotion) => void;
  onDelete: (id: number) => void;
  onSort: (column: string) => void;
  sortColumn: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PromotionTable: React.FC<PromotionTableProps> = ({
  promotions,
  onEdit,
  onDelete,
  onSort,
  sortColumn,
  sortOrder,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={sortColumn === 'name' ? sortOrder : false}>
              <TableSortLabel
                active={sortColumn === 'name'}
                direction={sortOrder}
                onClick={() => onSort('name')}
              >
                Название рассылки
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortColumn === 'date' ? sortOrder : false}>
              <TableSortLabel
                active={sortColumn === 'date'}
                direction={sortOrder}
                onClick={() => onSort('date')}
              >
                Дата рассылки
              </TableSortLabel>
            </TableCell>
            <TableCell>
              Кол-во отправленных подарков
            </TableCell>
            <TableCell>
              Отмена рассылки
            </TableCell>
            <TableCell>
              Редактировать рассылку
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.id}>
              <TableCell>{promotion.name}</TableCell>
              <TableCell>{format(new Date(promotion.date), 'dd.MM.yyyy')}</TableCell>
              <TableCell>{promotion.sentGifts}</TableCell>
              <TableCell>
                <IconButton onClick={() => onDelete(promotion.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(promotion)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={promotions.length}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
};

export default PromotionTable;