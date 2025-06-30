import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectGroup,
    SelectLabel,
} from "@/Components/ui/select";
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

export default function LaporSampah({ auth, database }: PageProps & { database: any[] }) { // Tipe 'database' bisa lebih spesifik jika Anda tahu strukturnya
    const { data, setData, post, processing, errors, reset } = useForm({
        jenis_sampah: "",
        berat_sampah: 0,
        total_harga: 0,
        point: 0,
        latitude: 0,
        longitude: 0,
        foto_sampah: null as File | null, // Tambahkan tipe File | null untuk foto_sampah
    });

    const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setData((prevData) => ({
                        ...prevData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }));
                },
                (error: GeolocationPositionError) => { // Perbaikan: Tipe 'error' untuk Geolocation
                    console.error("Error mendapatkan lokasi:", error); // Pesan lebih deskriptif
                    setErrorMessage("Gagal mendapatkan lokasi Anda. Pastikan izin lokasi diberikan."); // Tampilkan error di UI
                    // Opsional: set default latitude/longitude ke 0 atau nilai lain yang menandakan error
                    setData((prevData) => ({
                        ...prevData,
                        latitude: 0,
                        longitude: 0,
                    }));
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
            setErrorMessage("Browser Anda tidak mendukung Geolocation."); // Tampilkan error di UI
        }
    }, []);

    const handleBeratSampahChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Perbaikan: Tipe event
        const berat = parseInt(e.target.value); // Pastikan ini dikonversi ke number
        setData((prevData) => ({
            ...prevData,
            berat_sampah: isNaN(berat) ? 0 : berat, // Handle NaN jika input kosong/tidak valid
            total_harga: (isNaN(berat) ? 0 : berat) * 5000,
            point: isNaN(berat) ? 0 : berat,
        }));
    };

    const submitLocation = (e: React.FormEvent) => { // Perbaikan: Tipe event
        e.preventDefault();
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            // Pastikan Anda menangani kasus 'null' untuk foto_sampah jika tidak diisi
            if (key === 'foto_sampah' && data.foto_sampah === null) {
                // Jangan append jika null, atau berikan penanganan error jika required
                return;
            }
            formData.append(key, (data as any)[key]);
        });

        post(route("lapor-sampah.store"), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
                setErrorMessage(""); // Reset error message on success
            },
            onError: (err: { message?: string; errors?: Record<string, string[]> }) => { // Perbaikan: Tipe 'err'
                let errorMsg = "Gagal melaporkan sampah. Silakan coba lagi.";
                if (err.message) {
                    errorMsg = err.message;
                } else if (err.errors) {
                    const validationErrors = Object.values(err.errors).flat();
                    if (validationErrors.length > 0) {
                        errorMsg = validationErrors.join("\n");
                    }
                }
                setErrorMessage(errorMsg); // Tampilkan error di dialog, jangan tutup dialog
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Lapor Sampah
                </h2>
            }
        >
            <Head title="Lapor Sampah" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <main className="grid flex-1 overflow-hidden items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                        <Tabs defaultValue="semua">
                            <div className="flex items-center">
                                <TabsList>
                                    <TabsTrigger value="semua">
                                        Semua
                                    </TabsTrigger>
                                </TabsList>
                                <div className="ml-auto flex items-center gap-2">
                                    <Dialog
                                        open={isDialogOpen}
                                        onOpenChange={setIsDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                className="h-8 gap-1"
                                            >
                                                <PlusCircle className="h-3.5 w-3.5" />
                                                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                                    Lapor Sampah
                                                </span>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px] md:max-w-[70vw]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Lapor Sampah
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Buat dunia semakin bersih.
                                                    Klik tambah saat sudah
                                                    selesai.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form
                                                onSubmit={submitLocation}
                                                className="grid gap-4 py-4"
                                            >
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="foto"
                                                        className="text-left"
                                                    >
                                                        Foto Sampah:
                                                    </Label>
                                                    <Input
                                                        id="foto"
                                                        className="col-span-7"
                                                        type="file"
                                                        onChange={(e) => {
                                                            const files = e.target.files;
                                                            if (files && files.length > 0) { // Perbaikan: TS18047
                                                                setData(
                                                                    (prevData) => ({
                                                                        ...prevData,
                                                                        foto_sampah: files[0],
                                                                    })
                                                                );
                                                            } else {
                                                                setData(
                                                                    (prevData) => ({
                                                                        ...prevData,
                                                                        foto_sampah: null, // Reset jika tidak ada file
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="jenisSampah" // Ganti htmlFor dari "foto" ke "jenisSampah"
                                                        className="text-left"
                                                    >
                                                        Jenis Sampah:
                                                    </Label>
                                                    <Select
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            setData(
                                                                (prevData) => ({
                                                                    ...prevData,
                                                                    jenis_sampah:
                                                                        value,
                                                                })
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="col-span-7">
                                                            <SelectValue placeholder="Jenis Sampah" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectItem value="organik">
                                                                    Organik
                                                                </SelectItem>
                                                                <SelectItem value="anorganik">
                                                                    Anorganik
                                                                </SelectItem>
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="beratSampah"
                                                        className="text-left"
                                                    >
                                                        Berat Sampah (kg):
                                                    </Label>
                                                    <Input
                                                        id="beratSampah"
                                                        value={data.berat_sampah === 0 ? '' : data.berat_sampah} // Perbaikan: Tampilkan kosong jika 0
                                                        onChange={
                                                            handleBeratSampahChange
                                                        }
                                                        className="col-span-7"
                                                        type="number"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="totalHarga"
                                                        className="text-left"
                                                    >
                                                        Total Harga (Rp):
                                                    </Label>
                                                    <Input
                                                        id="totalHarga"
                                                        value={data.total_harga}
                                                        className="col-span-7"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="point"
                                                        className="text-left"
                                                    >
                                                        Point
                                                        <br />
                                                        (1kg = 1 point):
                                                    </Label>
                                                    <Input
                                                        id="point"
                                                        value={data.point}
                                                        className="col-span-7"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="latitude"
                                                        className="text-left"
                                                    >
                                                        Latitude:
                                                    </Label>
                                                    <Input
                                                        id="latitude"
                                                        value={
                                                            location.latitude
                                                        }
                                                        className="col-span-7"
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="grid grid-cols-8 items-center gap-2">
                                                    <Label
                                                        htmlFor="longitude"
                                                        className="text-left"
                                                    >
                                                        Longitude:
                                                    </Label>
                                                    <Input
                                                        id="longitude"
                                                        value={
                                                            location.longitude
                                                        }
                                                        className="col-span-7"
                                                        readOnly
                                                    />
                                                </div>
                                                {errorMessage && (
                                                    <p className="text-red-500 text-sm col-span-8">{errorMessage}</p>
                                                )}
                                                <DialogFooter>
                                                    <Button
                                                        type="submit"
                                                        disabled={processing}
                                                    >
                                                        Lapor
                                                    </Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                            <TabsContent value="semua">
                                <Card x-chunk="dashboard-06-chunk-0">
                                    <CardHeader>
                                        <CardTitle>Laporan Sampah</CardTitle>
                                        <CardDescription>
                                            Kelola laporan sampah Anda dan lihat
                                            kinerjanya.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                                        No.
                                                    </TableHead>
                                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                                        Nama
                                                    </TableHead>
                                                    <TableHead className="hidden w-[100px] sm:table-cell">
                                                        Foto Sampah
                                                    </TableHead>
                                                    <TableHead>
                                                        Jenis Sampah
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Berat Sampah
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Total Harga
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Point
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Dibuat pada
                                                    </TableHead>
                                                    <TableHead className="hidden md:table-cell">
                                                        Lokasi
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(database as any[]).map( // Perbaikan: TS18046
                                                    (item: any, index: number) => ( // Perbaikan: Tipe 'index'
                                                        <TableRow key={item.id}>
                                                            <TableCell className="hidden md:table-cell">
                                                                {index + 1}.
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {item.nama}
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell">
                                                                <img
                                                                    alt="Product image"
                                                                    className="aspect-square rounded-md object-cover"
                                                                    height="64"
                                                                    src={
                                                                        item.foto_sampah ||
                                                                        "/placeholder.svg"
                                                                    }
                                                                                                        width="64"
                                                                />
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {
                                                                    item.jenis_sampah
                                                                }
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {
                                                                    item.berat_sampah
                                                                }{" "}
                                                                kg
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                Rp.{" "}
                                                                {
                                                                    item.total_harga
                                                                }
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {item.point}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                {item.createdAt}
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                lang:{" "}
                                                                {item.latitude}
                                                                <br />
                                                                lat:{" "}
                                                                {item.longitude}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}