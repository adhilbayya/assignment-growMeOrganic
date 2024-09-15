import { useEffect, useRef, useState } from "react";
import { fetchArtworks, Artwork } from "./api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Artwork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numRowsToSelect, setNumRowsToSelect] = useState<number | null>(null);

  const overlayPanelRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    const loadArtworks = async (page: number) => {
      try {
        setLoading(true);
        const { artworks, totalRecords } = await fetchArtworks(page);
        setArtworks(artworks);
        setTotalRecords(totalRecords);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks(currentPage);
  }, [currentPage]);

  const onPageChange = (event: any) => {
    setCurrentPage(event.page + 1);
  };

  const handleOverlaySubmit = async () => {
    const itemsPerPage = 12;
    const pagesNeeded = Math.ceil(numRowsToSelect! / itemsPerPage);

    let allArtworks: Artwork[] = [];
    for (let i = 1; i <= pagesNeeded; i++) {
      const { artworks } = await fetchArtworks(i);
      allArtworks = [...allArtworks, ...artworks];
    }

    setSelectedProducts(allArtworks.slice(0, numRowsToSelect!));
    overlayPanelRef.current?.hide();
  };

  return (
    <div className="datatable-demo">
      {error && <p>Error: {error}</p>}

      <DataTable
        value={artworks}
        selectionMode={"checkbox"}
        loading={loading}
        responsiveLayout="scroll"
        selection={selectedProducts!}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column
          field="title"
          header={
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                icon="pi pi-chevron-down"
                className="p-button-text"
                onClick={(e) => overlayPanelRef.current?.toggle(e)}
              />
              <span style={{ marginLeft: "0.5rem" }}>Title</span>
            </div>
          }
        />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Date Start" />
        <Column field="date_end" header="Date End" />
      </DataTable>

      <Paginator
        first={(currentPage - 1) * 10}
        rows={10}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />

      <OverlayPanel ref={overlayPanelRef}>
        <div
          style={{ padding: "1rem", display: "flex", flexDirection: "column" }}
        >
          <InputNumber
            value={numRowsToSelect}
            onValueChange={(e) => setNumRowsToSelect(e.value || 0)}
            placeholder="Select rows..."
            min={0}
            max={totalRecords}
          />
          <Button
            label="Submit"
            onClick={handleOverlaySubmit}
            style={{ marginTop: "1rem" }}
          />
        </div>
      </OverlayPanel>
    </div>
  );
};

export default App;
