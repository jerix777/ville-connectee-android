import { MainLayout } from "@/components/layout/MainLayout";

export default function SteveYobouetPage() {
  return (
    <MainLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
          <div className="text-center">
            <img 
              src="/lovable-uploads/31d0ac0e-95b5-4b85-b673-192256cdbdb6.png" 
              alt="Steve Yobouet" 
              className="mx-auto mb-8 max-w-full h-auto rounded-lg shadow-lg"
            />
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 shadow-md border border-border">
              <p className="text-lg leading-relaxed text-foreground mb-6">
                Cette application est un outil apporté aux populations de Ouellé pour mettre à leur disposition la ville: ses services, ses commerces et plusieurs types d'informations utiles.
              </p>
              
              <p className="text-lg leading-relaxed text-foreground mb-6">
                Elle permet à ceux qui sont hors de Ouellé d'y accéder sans y être et à ceux qui y sont d'être informés sans se déplacer.
              </p>
              
              <p className="text-lg leading-relaxed text-foreground mb-8">
                Participons au bien-être de nos parents par tous les moyens
              </p>
              
              <div className="text-right">
                <p className="text-xl font-semibold text-foreground mb-2">
                  Steve YOBOUET
                </p>
                <p className="text-lg text-muted-foreground">
                  Ouellé en mouvement
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}