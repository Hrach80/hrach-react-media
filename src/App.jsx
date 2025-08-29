import React, { useState, useEffect } from 'react';
import MediaPlayer from './components/Medi/MediaPlayer';
import CategorySelector from './components/cotegori/CategorySelector';
import { useRegisterSW } from 'virtual:pwa-register/react';

function App() {
  const jamendoClientId = '6dc7dd8b';
  const [selectedCategory, setSelectedCategory] = useState('all');

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (offlineReady) {
      console.log('Հավելվածը պատրաստ է օֆլայն ռեժիմի համար');
    }
  }, [offlineReady]);

  const closeNotification = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (needRefresh) {
    return (
      <div className="pwa-notification">
        <p>Մատչելի է հավելվածի նոր տարբերակ։ Թարմացնելու համար սեղմեք <a href="#" onClick={updateServiceWorker}>այստեղ</a>։</p>
        <button onClick={closeNotification}>Փակել</button>
      </div>
    );
  }

  return (
    <div className="App">
      <CategorySelector onSelectCategory={setSelectedCategory} />
      <MediaPlayer clientId={jamendoClientId} category={selectedCategory} />
    </div>
  );
}

export default App;