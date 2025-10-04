import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { santeService } from "@/services/santeService";
import { useToast } from "@/hooks/use-toast";

interface Props {
    inline?: boolean;
    onClose?: () => void;
    onCreated?: (createdId: string) => void;
    initial?: Partial<import("@/services/santeService").EtablissementSante>;
}

export function AddSanteProximiteForm(
    { inline = false, onClose, onCreated, initial = {} }: Props,
) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const [form, setForm] = useState({
        nom: initial.nom || "",
        type: initial.type || "pharmacie",
        adresse: initial.adresse || "",
        latitude: initial.latitude?.toString() || "",
        longitude: initial.longitude?.toString() || "",
        telephone: initial.telephone || "",
        email: initial.email || "",
        horaires: initial.horaires || "",
        services: (initial.services || []).join(", ") || "",
        urgences: initial.urgences ?? false,
        garde_permanente: initial.garde_permanente ?? false,
        description: initial.description || "",
        image_url: initial.image_url || "",
    });

    const createMutation = useMutation({
        mutationFn: (payload: any) => santeService.createEtablissement(payload),
        onSuccess: (data) => {
            toast({
                title: "Établissement créé",
                description: "L'établissement a bien été créé.",
            });
            setForm({
                nom: "",
                type: "pharmacie",
                adresse: "",
                latitude: "",
                longitude: "",
                telephone: "",
                email: "",
                horaires: "",
                services: "",
                urgences: false,
                garde_permanente: false,
                description: "",
                image_url: "",
            });
            setIsOpen(false);
            if (onCreated) onCreated(data.id);
            if (onClose) onClose();
        },
        onError: (err) => {
            console.error(err);
            toast({
                title: "Erreur",
                description: "Impossible de créer l'établissement.",
                variant: "destructive",
            });
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckbox = (name: string, value: boolean) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelect = (value: string) =>
        setForm((prev) => ({ ...prev, type: value }));

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const payload = {
            nom: form.nom,
            type: form.type,
            adresse: form.adresse,
            latitude: parseFloat(form.latitude) || 0,
            longitude: parseFloat(form.longitude) || 0,
            telephone: form.telephone || null,
            email: form.email || null,
            horaires: form.horaires || null,
            services: form.services
                ? form.services.split(",").map((s) => s.trim())
                : null,
            urgences: !!form.urgences,
            garde_permanente: !!form.garde_permanente,
            description: form.description || null,
            image_url: form.image_url || null,
        };

        createMutation.mutate(payload);
    };

    const formContent = (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nom de l'établissement</Label>
                        <Input
                            name="nom"
                            value={form.nom}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={form.type} onValueChange={handleSelect}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pharmacie">
                                    Pharmacie
                                </SelectItem>
                                <SelectItem value="clinique">
                                    Clinique
                                </SelectItem>
                                <SelectItem value="hopital">Hôpital</SelectItem>
                                <SelectItem value="cabinet">Cabinet</SelectItem>
                                <SelectItem value="laboratoire">
                                    Laboratoire
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input
                            name="adresse"
                            value={form.adresse}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Quartier / Base (optionnel)</Label>
                        <Input
                            name="adresse_detail"
                            value={form.adresse}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div className="space-y-2">
                        <Label>Latitude</Label>
                        <Input
                            name="latitude"
                            value={form.latitude}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Longitude</Label>
                        <Input
                            name="longitude"
                            value={form.longitude}
                            onChange={handleChange}
                        />
                    </div> */}
                    <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input
                            name="telephone"
                            value={form.telephone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>
                    {/* <div className="space-y-2 md:col-span-2">
                        <Label>Horaires</Label>
                        <Input
                            name="horaires"
                            value={form.horaires}
                            onChange={handleChange}
                        />
                    </div> */}
                    {/* <div className="space-y-2 md:col-span-2">
                        <Label>Services (séparés par une virgule)</Label>
                        <Input
                            name="services"
                            value={form.services}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            checked={!!form.urgences}
                            onCheckedChange={(v) =>
                                handleCheckbox("urgences", !!v)}
                        />
                        <Label>Urgences</Label>
                        <Checkbox
                            checked={!!form.garde_permanente}
                            onCheckedChange={(v) =>
                                handleCheckbox("garde_permanente", !!v)}
                        />
                        <Label>Garde permanente</Label>
                    </div> */}
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            if (onClose) onClose();
                        }}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                        {createMutation.isPending
                            ? "Enregistrement..."
                            : "Enregistrer"}
                    </Button>
                </div>
            </form>
        </div>
    );

    if (inline) return formContent;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajouter un établissement de santé</DialogTitle>
                </DialogHeader>
                {formContent}
            </DialogContent>
        </Dialog>
    );
}

export default AddSanteProximiteForm;
