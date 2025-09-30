import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/common/PageLayout";
import { HotelCard } from "./components/HotelCard";
import { FilterSection } from "./components/FilterSection";
import { AddHotelForm } from "./components/AddHotelForm";
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { hotelService, type Hotel } from "@/services/hotelService";
import { usePagination } from "@/hooks/usePagination";
import { Hotel as HotelIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function HotelGaz() {
  const [activeTab, setActiveTab] = useState<string>("tous");
  const [activeViewTab, setActiveViewTab] = useState<string>("liste");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("tous");

  const loadHotels = async () => {
    setLoading(true);
    setError(null);
    try {
      let results = await hotelService.getAllHotels();

      if (typeFilter && typeFilter !== "tous") {
        results = results.filter((h) => h.type === typeFilter);
      }

      setHotels(results);
    } catch (error) {
      console.error("Error loading hotels:", error);
      setError("Erreur lors du chargement des hôtels");
      toast({
        title: "Erreur",
        description: "Erreur lors du chargement des hôtels",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [typeFilter]);

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, "_self");
  };

  const handleDirections = (address: string) => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`,
      "_blank",
    );
  };

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch = !searchQuery ||
      hotel.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.adresse.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hotel.description &&
        hotel.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hotel.contact1 &&
        hotel.contact1.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (hotel.contact2 &&
        hotel.contact2.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  const chambres = filteredHotels.filter((s) => s.type === "chambre");
  const auberges = filteredHotels.filter((s) => s.type === "auberge");
  const residences = filteredHotels.filter(
    (s) => s.type === "residence-meublee",
  );

  const getTabData = () => {
    switch (activeTab) {
      case "auberge":
        return auberges;
      case "residence-meublee":
        return residences;
      case "chambre":
        return chambres;
      default:
        return filteredHotels;
    }
  };

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedHotels,
    goToPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    data: getTabData(),
    itemsPerPage: 9,
  });

  const customTabs = [
    { value: "tous", label: `Tous (${filteredHotels.length})` },
    { value: "auberge", label: `Auberges (${auberges.length})` },
    { value: "residence-meublee", label: `Résidences (${residences.length})` },
    { value: "chambre", label: `Chambres (${chambres.length})` },
  ];

  const renderSearchContent = () => {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {
            /* <div className="lg:w-80 flex-shrink-0">
            <div className="space-y-4">
              <FilterSection
                typeFilter={typeFilter}
                onTypeChange={setTypeFilter}
                radiusFilter={radiusFilter}
                onRadiusChange={setRadiusFilter}
                hasLocation={userLocation !== null}
              />
              <GeolocationButton
                onLocationFound={handleLocationFound}
              />
            </div>
          </div> */
          }

          <div className="flex-1">
            {loading && <LoadingSkeleton type="list" count={3} />}

            {!loading && hotels.length === 0 && (
              <EmptyState
                icon={HotelIcon}
                title="Aucun hôtel trouvé"
                description="Aucun hôtel n'a été trouvé. Ajoutez-en un pour commencer."
              />
            )}

            {!loading && filteredHotels.length > 0 && (
              <div className="space-y-4">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-6 flex-wrap">
                    {customTabs.map((t) => (
                      <TabsTrigger key={t.value} value={t.value}>
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {customTabs.map((t) => (
                    <TabsContent key={t.value} value={t.value}>
                      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                        {paginatedHotels.map((hotel) => (
                          <HotelCard
                            key={hotel.id}
                            hotel={hotel}
                            onCall={handleCall}
                            onDirections={handleDirections}
                          />
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout
      moduleId="hotelerie"
      title="Hôtels et Résidences"
      description="Contactez les hôtels et résidences de Ouellé, Daoukro, M'Bahiakro, Prikro et plus pour passer vos réservations."
      icon={HotelIcon}
      iconClassName="text-blue-600"
      activeTab={activeViewTab}
      onTabChange={setActiveViewTab}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Rechercher un hôtel par nom, adresse, contact..."
      addContent={<AddHotelForm onClose={() => setActiveViewTab("liste")} />}
      loading={loading}
      hasData={filteredHotels.length > 0}
      emptyStateIcon={HotelIcon}
      emptyStateTitle="Aucun hôtel trouvé"
      emptyStateDescription="Aucun hôtel ne correspond à vos critères de recherche."
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      canGoNext={canGoNext}
      canGoPrevious={canGoPrevious}
      resultCount={filteredHotels.length}
      customTabs={customTabs}
      skeletonType="grid"
      skeletonCount={6}
      listContent={error
        ? (
          <div className="text-center py-10 text-red-500">
            <p>{error}</p>
          </div>
        )
        : renderSearchContent()}
    />
  );
}
