import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

import { useState } from "react";
import { useForm } from "@inertiajs/react";

const cards = [
    {
        id: 1,
        title: "Gas LPG 3 kg",
        point: 6,
        url: "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/4/3/689d41de-7c3d-4163-8913-6f3fa8101206.jpg",
    },
    {
        id: 2,
        title: "Minyak 1 liter",
        point: 3,
        url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//100/MTA-27912268/br-m036969-03858_minyak-goreng-bimoli-1liter-pouch_full01.jpg",
    },
    {
        id: 3,
        title: "Beras 10 kg",
        point: 10,
        url: "https://cdn.antaranews.com/cache/1200x800/2021/01/22/rice-3997767_1920.jpg",
    },
    {
        id: 4,
        title: "Indomie 1 dus",
        point: 8,
        url: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full//93/MTA-2583228/indomie_indomie-goreng-mie-instan--85g--_full02.jpg",
    },
    {
        id: 5,
        title: "Telor 1 kg",
        point: 5,
        url: "https://images.tokopedia.net/img/cache/700/VqbcmM/2023/11/9/3e34492a-5e6d-4605-9608-69ca1839d588.jpg",
    },
    {
        id: 6,
        title: "Kecap 500 ml",
        point: 2,
        url: "https://images.tokopedia.net/img/cache/500-square/VqbcmM/2022/3/8/dfbe4fab-11be-46fd-8422-de3151e35f85.jpg",
    },
    {
        id: 7,
        title: "Gula 1kg",
        point: 2,
        url: "https://id-live-01.slatic.net/p/2d47f4976de738381b2e93cc7bcf3732.jpg",
    },
    {
        id: 8,
        title: "Kompor",
        point: 20,
        url: "https://images.tokopedia.net/img/cache/700/VqbcmM/2022/1/5/76e93b78-5d8c-4bd6-bf3e-18737d6ae122.jpg",
    },
    {
        id: 9,
        title: "Motor",
        point: 100,
        url: "https://www.wahanahonda.com/assets/upload/produk/varian_warna/15/PRODUK_VARIAN-WARNA_15_04-02-2024_65be712821333.webp",
    },
];

type CardItem = {
    id: number;
    title: string;
    point: number;
    url: string;
};

// Define the expected structure of the Inertia form data for this specific form
// Ini akan mencakup semua data yang MUNGKIN dikirim oleh form,
// meskipun tidak semua akan selalu ada di setiap request
interface RedeemFormData {
    item_id: number;
    points_cost: number;
}


export default function Insentif({ auth, totalPoints: initialTotalPoints }: PageProps & { totalPoints: number }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CardItem | null>(null);
    const [currentTotalPoints, setCurrentTotalPoints] = useState(initialTotalPoints);
    const [errorMessage, setErrorMessage] = useState("");
    const [showAddressDialog, setShowAddressDialog] = useState(false);
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState("");

    // Inisialisasi useForm dengan data yang akan dikirim.
    // Jika ada properti yang tidak selalu ada, gunakan opsional (?)
    const { data, setData, post, processing, errors } = useForm<RedeemFormData>({
        item_id: 0,
        points_cost: 0,
    });


    const handleOpenDialog = (item: CardItem) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
        setErrorMessage(""); // Reset error saat dialog dibuka
        setData({
            item_id: item.id,
            points_cost: Number(item.point),
        });
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedItem(null);
        setErrorMessage("");
        // Opsional: Reset form data juga saat menutup dialog
        // reset(); // Jika Anda ingin mengosongkan form data sepenuhnya
    };

    const handleRedeem = async () => {
        if (!selectedItem) {
            console.error("Tidak ada item yang dipilih untuk ditukar.");
            return;
        }

        const itemCost = Number(selectedItem.point);
        let userPoints = Number(currentTotalPoints);

        if (userPoints < itemCost) {
            setErrorMessage("Poin Anda tidak cukup untuk menukar item ini!");
            return;
        }

        try {
            const response = await fetch(route('redeem.item'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({
                    item_id: selectedItem.id,
                    points_cost: selectedItem.point
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setCurrentTotalPoints(data.total_points);
                setErrorMessage('');
                setShowAddressDialog(true); // Tampilkan dialog alamat setelah sukses
                // handleCloseDialog(); // Jangan tutup dialog utama dulu
            } else {
                setErrorMessage(data.message || 'Gagal menukar item. Silakan coba lagi.');
            }
        } catch (err) {
            setErrorMessage('Gagal menukar item. Silakan coba lagi.');
            console.error('Error saat menukar:', err);
        }
    };

    const handleSubmitAddress = async () => {
        if (!address.trim()) {
            setAddressError("Alamat tidak boleh kosong!");
            return;
        }
        setAddressError("");
        try {
            const response = await fetch(route('redeem.address'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || ''
                },
                body: JSON.stringify({
                    item_id: selectedItem?.id,
                    address: address
                })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setShowAddressDialog(false);
                handleCloseDialog();
                alert("Alamat penerima hadiah berhasil disimpan: " + address);
                setAddress("");
            } else {
                setAddressError(data.message || 'Gagal menyimpan alamat. Silakan coba lagi.');
            }
        } catch (err) {
            setAddressError('Gagal menyimpan alamat. Silakan coba lagi.');
            console.error('Error saat menyimpan alamat:', err);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Insentif
                </h2>
            }
        >
            <Head title="Insentif" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 ">
                    <h1 className=" text-xl font-bold mb-4">
                        Point Anda: {currentTotalPoints}
                    </h1>
                    <div className="grid grid-cols-3 gap-6">
                        {cards.map((item: CardItem) => (
                            <Card className="w-[380px]" key={item.id}>
                                <CardHeader>
                                    <CardTitle>{item.title}</CardTitle>
                                    <CardDescription>
                                        {item.point} Point
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <img
                                        alt={item.title}
                                        className="aspect-square object-cover w-full h-[300px]"
                                        src={item.url}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/placeholder.png';
                                        }}
                                    />
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        onClick={() => handleOpenDialog(item)}
                                        disabled={Number(currentTotalPoints) < Number(item.point) || processing}
                                        style={{ opacity: Number(currentTotalPoints) < Number(item.point) ? 0.5 : 1 }}
                                    >
                                        <img src={item.url} alt="icon" style={{ width: 24, height: 24, marginRight: 8, borderRadius: 4, objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }} />
                                        Tukar
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Penukaran</DialogTitle>
                        <DialogDescription>
                            Anda yakin ingin menukar
                            <span className="font-bold"> {selectedItem?.title}</span> seharga
                            <span className="font-bold"> {selectedItem?.point} poin</span>?
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <img
                            alt={selectedItem?.title}
                            className="aspect-square object-cover w-full h-[200px]"
                            src={selectedItem?.url}
                        />
                        <p>Poin Anda saat ini: <span className="font-semibold">{currentTotalPoints}</span></p>
                        <p>Poin setelah penukaran: <span className="font-semibold">{currentTotalPoints - (selectedItem?.point || 0)}</span></p>
                        {errorMessage && (
                            <p className="text-red-500 text-sm">{errorMessage}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCloseDialog}>
                            Batal
                        </Button>
                        <Button onClick={handleRedeem} disabled={processing}>
                            {processing ? 'Menukar...' : 'Tukar Sekarang'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog untuk pengisian alamat penerima hadiah */}
            <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Alamat Penerima Hadiah</DialogTitle>
                        <DialogDescription>
                            Silakan isi alamat lengkap untuk pengiriman hadiah Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <Label htmlFor="address">Alamat Lengkap</Label>
                        <Input
                            id="address"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            placeholder="Masukkan alamat lengkap penerima hadiah"
                        />
                        {addressError && (
                            <p className="text-red-500 text-sm">{addressError}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddressDialog(false)}>
                            Batal
                        </Button>
                        <Button onClick={handleSubmitAddress}>
                            Simpan Alamat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}