import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger, DialogDescription } from '../../components/ui/dialog';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Checkbox } from "../../components/ui/checkbox";

const generateMerchantAccountsWithCorrectLogic = () => {
    const merchants = [];
    const merchantNames = ["Enplus Mağaza", "Tekno Market", "Kitap Dünyası", "Moda Butik", "Gurme Lezzetler", "Hızlı Kargo", "Ev Elektroniği"];

    for (let i = 0; i < merchantNames.length; i++) {
        const startingBalance = (Math.random() * 40000) - 30000;
        let runningBalance = startingBalance;
        const transactionHistory = [{
            date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
            netAmount: 0,
            balanceAfter: startingBalance,
            isStart: true,
        }];
        
        let settlementTriggered = false;
        let finalPayableAmount = 0;
        let finalStatus = 'Hakediş Oluşmadı';

        for (let j = 0; j < 7; j++) {
            if (settlementTriggered) continue; 

            const date = new Date(Date.now() - (6 - j) * 24 * 60 * 60 * 1000);
            const dailyNet = (Math.random() * (runningBalance < -10000 ? 20000 : 10000)) - (runningBalance < -10000 ? 2000 : 5000);

            const balanceBefore = runningBalance;
            runningBalance += dailyNet;
            
            transactionHistory.push({
                date: date,
                netAmount: dailyNet,
                balanceAfter: runningBalance,
                isStart: false,
            });

            if (balanceBefore <= 0 && runningBalance > 0) {
                settlementTriggered = true;
                finalPayableAmount = runningBalance;
                finalStatus = 'Hakediş Oluştu';
            }
        }
        
        if (!settlementTriggered) {
            finalPayableAmount = runningBalance;
        }
        
        merchants.push({
            merchantId: `M${11041 + i}`,
            merchantName: merchantNames[i],
            title: `${merchantNames[i]} A.Ş.`,
            iban: `TR${Math.floor(Math.random() * 10000000000000000)}`,
            payableAmount: finalPayableAmount,
            status: finalStatus,
            history: transactionHistory,
        });
    }
     merchants.push({
        merchantId: `M${11041 + merchants.length}`,
        merchantName: "Yeni Giren Market",
        title: `Yeni Giren Market A.Ş.`,
        iban: `TR${Math.floor(Math.random() * 10000000000000000)}`,
        payableAmount: -15000,
        status: 'Hakediş Oluşmadı',
        history: [ { date: new Date(), netAmount: -15000, balanceAfter: -15000, isStart: true } ],
    });

    return merchants;
}


type MerchantAccount = ReturnType<typeof generateMerchantAccountsWithCorrectLogic>[0];
type FilterType = 'eligible' | 'ineligible' | 'all';

interface PaymentApprovalDashboardProps {
  onShowDailyDetails: (date: Date, merchantId: string) => void;
}

export default function PaymentApprovalDashboard({ onShowDailyDetails }: PaymentApprovalDashboardProps) {
    const [accounts, setAccounts] = useState(generateMerchantAccountsWithCorrectLogic());
    const [filter, setFilter] = useState<FilterType>('eligible');
    const [selectedAccount, setSelectedAccount] = useState<MerchantAccount | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const eligibleAccounts = useMemo(() => 
        accounts.filter(acc => acc.status === 'Hakediş Oluştu'), 
    [accounts]);

    const filteredAccounts = useMemo(() => {
        return accounts.filter(acc => {
            if (filter === 'eligible') return acc.status === 'Hakediş Oluştu';
            if (filter === 'ineligible') return acc.status === 'Hakediş Oluşmadı';
            return true;
        });
    }, [accounts, filter]);
    
    useEffect(() => {
        setSelectedIds([]);
    }, [filter]);
    
    const handleSingleApproval = (merchantId: string) => {
        toast.success(`${merchantId} için ödeme onayı başarıyla verildi.`);
        setAccounts(prev => prev.filter(acc => acc.merchantId !== merchantId));
        setSelectedAccount(null);
    }
    
    const handleBulkApproval = () => {
        toast.success(`${selectedIds.length} adet hakediş için toplu ödeme onayı verildi.`);
        setAccounts(prev => prev.filter(acc => !selectedIds.includes(acc.merchantId)));
        setSelectedIds([]);
    };

    return (
        <TooltipProvider>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                         <CardTitle>Ödeme Onay Yönetimi</CardTitle>
                         {selectedIds.length > 0 && filter === 'eligible' && (
                            <Button onClick={handleBulkApproval}>
                                Seçilen {selectedIds.length} Hakedişi Onayla
                            </Button>
                        )}
                    </div>
                    <div className="flex space-x-2 pt-4">
                        <Button onClick={() => setFilter('eligible')} variant={filter === 'eligible' ? 'default' : 'outline'}>Hakediş Oluşanlar ({accounts.filter(a => a.status === 'Hakediş Oluştu').length})</Button>
                        <Button onClick={() => setFilter('ineligible')} variant={filter === 'ineligible' ? 'default' : 'outline'}>Hakediş Oluşmayanlar ({accounts.filter(a => a.status === 'Hakediş Oluşmadı').length})</Button>
                        <Button onClick={() => setFilter('all')} variant={filter === 'all' ? 'default' : 'outline'}>Tümü ({accounts.length})</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {filter === 'eligible' && (
                                    <TableHead className="w-[50px]">
                                        <Checkbox
                                            checked={selectedIds.length === eligibleAccounts.length && eligibleAccounts.length > 0}
                                            onCheckedChange={(checked) => {
                                                if(checked) {
                                                    setSelectedIds(eligibleAccounts.map(acc => acc.merchantId))
                                                } else {
                                                    setSelectedIds([])
                                                }
                                            }}
                                            aria-label="Tümünü seç"
                                        />
                                    </TableHead>
                                )}
                                <TableHead>Üye İş Yeri</TableHead>
                                <TableHead>IBAN</TableHead>
                                <TableHead className="text-right">Bakiye / Ödenecek Tutar</TableHead>
                                <TableHead className="text-center">Durum</TableHead>
                                <TableHead className="text-center">Aksiyon</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAccounts.map((account) => (
                                <TableRow key={account.merchantId}>
                                    {filter === 'eligible' && (
                                        <TableCell>
                                             <Checkbox
                                                checked={selectedIds.includes(account.merchantId)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedIds(prev => 
                                                        checked
                                                            ? [...prev, account.merchantId]
                                                            : prev.filter(id => id !== account.merchantId)
                                                    );
                                                }}
                                                aria-label="Satırı seç"
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>{account.merchantName}</TableCell>
                                    <TableCell className="font-mono">{account.iban}</TableCell>
                                    <TableCell className={`text-right font-semibold ${account.payableAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {account.payableAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={account.status === 'Hakediş Oluştu' ? 'default' : 'secondary'}>
                                            {account.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {account.status === 'Hakediş Oluştu' && (
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => setSelectedAccount(account)}
                                            >
                                                Detay ve Onay
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {selectedAccount && (
                 <Dialog open={!!selectedAccount} onOpenChange={(open) => !open && setSelectedAccount(null)}>
                    <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Muhasebe Özeti ve Ödeme Onayı: {selectedAccount.merchantName}</DialogTitle>
                             <DialogDescription>
                                Bu modal, üye işyerinin son bakiye hareketlerini özetler ve ödenecek tutar için onay mekanizması sunar.
                            </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                             <div className="space-y-2">
                                <h4 className="font-medium text-lg">Ödeme Bilgileri</h4>
                                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                    <p><strong>Ünvan:</strong> {selectedAccount.title}</p>
                                    <p><strong>IBAN:</strong> {selectedAccount.iban}</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        Ödenecek Tutar: {selectedAccount.payableAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-medium text-lg">Son Bakiye Hareketleri</h4>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Tarih</TableHead>
                                            <TableHead className="text-right">Günlük Net</TableHead>
                                            <TableHead className="text-right">Gün Sonu Bakiye</TableHead>
                                            <TableHead className="text-center">İncele</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedAccount.history.slice(-7).map((day) => (
                                            <TableRow key={day.date.toISOString()} className={day.balanceAfter > 0 && !day.isStart ? 'bg-green-50' : ''}>
                                                <TableCell>{format(day.date, 'dd.MM.yyyy')} {day.isStart ? '(Önceki Bakiye)' : ''}</TableCell>
                                                <TableCell className={`text-right ${day.netAmount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                     {day.isStart ? '-' : day.netAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                </TableCell>
                                                <TableCell className={`text-right font-medium ${day.balanceAfter > 0 ? 'text-black' : 'text-red-600'}`}>
                                                     {day.balanceAfter.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {!day.isStart && (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="icon" onClick={() => onShowDailyDetails(day.date, selectedAccount.merchantId)}>
                                                                    <Search className="h-4 w-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Bu güne ait tüm işlem detaylarını gör</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        <DialogFooter>
                             <DialogClose asChild>
                                <Button type="button" variant="secondary">İptal</Button>
                             </DialogClose>
                             <Button type="button" onClick={() => handleSingleApproval(selectedAccount.merchantId)} disabled={selectedAccount.status !== 'Hakediş Oluştu'}>
                                Onayla ve Ödeme Emri Oluştur
                             </Button>
                        </DialogFooter>
                    </DialogContent>
                 </Dialog>
            )}
        </TooltipProvider>
    );
}
