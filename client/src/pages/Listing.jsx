import { list } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);
  useEffect(() => {
    const fetchlisting = async () => {
      try {
        setLoading(true);
        const listingId = params.listingId;
        const res = await fetch(`/api/listing/get/${listingId}`);

        const data = await res.json();
        if (data.success === false) {
          setError(data.message);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true, error);
        setLoading(false);
      }
    };
    fetchlisting();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading..</p>}
      {error && <p>Something went wrong!</p>}

          {listing && !loading && !error && (
              


              <>
                  <Swiper navigation>
                      {listing.imageUrls.map((url, i) => (
                          <SwiperSlide key={i}>
                              <div className="h-[500px]" style={{background:`url(${url}) center repeat`, backgroundSize:"cover"}}></div>
                          </SwiperSlide>
                      ))}

              </Swiper>
              
              
              
              </>
      )}
    </main>
  );
}
