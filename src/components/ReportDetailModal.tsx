import { useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar as CalendarIcon } from 'lucide-react';

type Column<RowT> = {
  key: string;
  header: string;
  align?: 'left' | 'right' | 'center';
  render?: (row: RowT) => React.ReactNode;
};

interface ReportDetailModalProps<RowT extends Record<string, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  columns: Array<Column<RowT>>;
  rows: RowT[];
  enableDateFilter?: boolean;
  dateAccessor?: (row: RowT) => Date | null | undefined;
  initialPageSize?: number;
}

export default function ReportDetailModal<RowT extends Record<string, any>>({
  open,
  onOpenChange,
  title,
  description,
  columns,
  rows,
  enableDateFilter = false,
  dateAccessor,
  initialPageSize = 25,
}: ReportDetailModalProps<RowT>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const filteredRows = useMemo(() => {
    if (!enableDateFilter || !dateAccessor || !dateRange || !dateRange.from || !dateRange.to) {
      return rows;
    }
    const from = startOfDay(dateRange.from);
    const to = startOfDay(dateRange.to);
    return rows.filter((r) => {
      const d = dateAccessor(r);
      if (!d) return false;
      const sd = startOfDay(d);
      return (isAfter(sd, from) || sd.getTime() === from.getTime()) && (isBefore(sd, to) || sd.getTime() === to.getTime());
    });
  }, [rows, enableDateFilter, dateAccessor, dateRange]);

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredRows.slice(start, end);
  }, [filteredRows, currentPage, pageSize]);

  const handleClose = (o: boolean) => {
    if (!o) {
      setPage(1);
    }
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>

        <div className="flex flex-col gap-3 h-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              {enableDateFilter && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'LLL dd, y', { locale: tr })} - {format(dateRange.to, 'LLL dd, y', { locale: tr })}
                          </>
                        ) : (
                          format(dateRange.from, 'LLL dd, y', { locale: tr })
                        )
                      ) : (
                        <span>Tarih aralığı seçin</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={(r) => { setDateRange(r); setPage(1); }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sayfa boyutu</span>
              <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-lg overflow-auto max-h-[55vh]">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  {columns.map((c) => (
                    <TableHead key={c.key} className={cn(c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}>{c.header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedRows.map((row, idx) => (
                  <TableRow key={idx}>
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={cn(c.align === 'right' && 'text-right', c.align === 'center' && 'text-center')}
                      >
                        {c.render ? c.render(row) : (row as any)[c.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                {pagedRows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center text-gray-500">Kayıt bulunamadı</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Toplam {filteredRows.length} kayıt • Sayfa {currentPage} / {pageCount}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Önceki</Button>
              <Button variant="outline" disabled={currentPage >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>Sonraki</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


