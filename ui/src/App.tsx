import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const devMode = !window?.['invokeNative'];


interface TabButtonProps {
    index: number;
    activeTab: number;
    onClick: (index: number) => void;
  }
  
  const TabButton: React.FC<TabButtonProps> = ({
    index,
    activeTab,
    onClick,
    children,
  }) => {
    const isActive = index === activeTab;
  
    return (
      <button
        style={{
          marginRight: '10px',
          background: isActive ? 'rgb(153, 3, 3)' : 'none',
          color: isActive ? '#fff' : '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
        onClick={() => onClick(index)}
      >
        {children}
      </button>
    );
  };

const App = () => {
    const [theme, setTheme] = useState('dark');
    const appDiv = useRef(null);
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
      setActiveTab(index);
    };

    const [discounts, setDiscounts] = useState([
        {
            vehicleShopLabel: "PDM",
            vehicleLabel:"elegy",
            discount: 15,
        }
    ]);

    const [sellers, setSellers] = useState([
        {
            vehicleLabel: "Elegy",
            vehicleModel:"elegy",
            vehiclePrice: 200,
        }
    ]);

    window.addEventListener('message', (event) => {
        if (event.data.type === 'updateData') {
          setSellers(event.data.sellers);
          setDiscounts(event.data.discounts);
        }
      });

    const { setPopUp, getSettings, onSettingsChange, fetchNui} = window as any;

    useEffect(() => {
        if (devMode) {
            document.getElementsByTagName('html')[0].style.visibility = 'visible';
            document.getElementsByTagName('body')[0].style.visibility = 'visible';
            return;
        } else {
            getSettings().then((settings: any) => setTheme(settings.display.theme));
            onSettingsChange((settings: any) => setTheme(settings.display.theme));
        }
    }, []);

    useEffect(() => {
        
    }, []);

    const renderDiscounts = () => {
        if (!discounts) {
          return null;
        }
    
        return discounts.map(discount => (
            <>
                <div className='discountBox' >
                    <div className='discountOffer'>{discount.discount} % OFF</div>
                    <div className='discountInfo'>
                       {discount.vehicleShopLabel} - {discount.vehicleLabel}
                    </div>
                </div>
            </>
        ));
    };

    const renderSellers = () => {
        if (!sellers) {
          return null;
        }
    
        return sellers.map(seller => (
            <>
                <div className='vehicleBox' onClick={() => {
                    setPopUp({
                        title: 'Navigate',
                        description: 'Confirm your choice',
                        buttons: [
                            {
                                title: 'Cancel',
                                color: 'red',
                                cb: () => {
                                    console.log('Cancel');
                                }
                            },
                            {
                                title: 'Confirm',
                                color: 'blue',
                                cb: () => {
                                    fetchNui("markSeller", seller)
                                }
                            }
                        ]
                    });
                }}>
                    <p>{seller.vehicleLabel}</p>
                    <p className='price'>Price: {seller.vehiclePrice} USD</p>
                </div>
            </>
        ));
    };

    return (
        <AppProvider>
            <div className='app' ref={appDiv} data-theme={theme}>
                <div className='app-wrapper'>
                    <div className='header'>
                        <div className='title'><span>4</span>DOORS</div>
                        <div className='subtitle'>We check cars for ya!</div>
                    </div>
                    <div className='button-wrapper'>
                        
                        <div>
                            <div className='tabsButtons' style={{ marginBottom: '10px' }}>
                                <TabButton
                                    index={0}
                                    activeTab={activeTab}
                                    onClick={handleTabClick}
                                >
                                Discounts
                                </TabButton>
                                <TabButton
                                    index={1}
                                    activeTab={activeTab}
                                    onClick={handleTabClick}
                                >
                                Vehicles
                                </TabButton>
                            </div>
                                <div>
                                    {activeTab === 0 && <div className='tabContent'>
                                        <div className='wrapper'>
                                            {renderDiscounts()}
                                        </div>
                                    </div>}
                                    {activeTab === 1 && <div className='tabContent'>
                                        <div className='wrapper'>
                                            {renderSellers()}
                                        </div>
                                    </div>}
                                </div>
                            </div>

                     
                    </div>
                </div>
            </div>
        </AppProvider>
    );
};

const AppProvider: React.FC = ({ children }) => {
    if (devMode) {
        return <div className='dev-wrapper'>{children}</div>;
    } else return children;
};

export default App;
