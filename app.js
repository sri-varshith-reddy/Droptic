const App = () => {
    const [activeTab, setActiveTab] = React.useState('eye');
    const [eyeInterval, setEyeInterval] = React.useState(20);
    const [waterTarget, setWaterTarget] = React.useState(2000);
    const [waterIntake, setWaterIntake] = React.useState(0);
    const [customTime, setCustomTime] = React.useState('');
    const [customMessage, setCustomMessage] = React.useState('');
    const [customUrl, setCustomUrl] = React.useState('');

    React.useEffect(() => {
        chrome.storage.local.get(['waterIntake'], (result) => {
            if (result.waterIntake) setWaterIntake(result.waterIntake);
        });
    }, []);

    const setEyeReminder = () => {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Eye Reminder',
            message: 'Time to take a break and rest your eyes!'
        });
    };

    const logWater = () => {
        const newIntake = waterIntake + 250;
        setWaterIntake(newIntake);
        chrome.storage.local.set({ waterIntake: newIntake });
    };

    const setCustomReminder = () => {
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icon.png',
            title: 'Custom Reminder',
            message: customMessage
        });
        
        if (customUrl) {
            chrome.tabs.create({ url: customUrl });
        }
    };

    return (
        <div className="container">
            <div className="tabs">
                <div className={`tab ${activeTab === 'eye' ? 'active' : ''}`} onClick={() => setActiveTab('eye')}>Eye Reminder</div>
                <div className={`tab ${activeTab === 'water' ? 'active' : ''}`} onClick={() => setActiveTab('water')}>Water Intake</div>
                <div className={`tab ${activeTab === 'custom' ? 'active' : ''}`} onClick={() => setActiveTab('custom')}>Custom Reminder</div>
            </div>

            {activeTab === 'eye' && (
                <div className="content">
                    <h3>Eye Reminder</h3>
                    <input type="number" value={eyeInterval} onChange={(e) => setEyeInterval(e.target.value)} placeholder="Interval in minutes" />
                    <button onClick={setEyeReminder}>Set Reminder</button>
                </div>
            )}


            {activeTab === 'water' && (
                <div className="content">
                    <h3>Water Intake</h3>
                    <input type="number" value={waterTarget} onChange={(e) => setWaterTarget(e.target.value)} placeholder="Daily target (ml)" />
                    <div className="water-log">
                        <input type="number" value={waterIntake} readOnly />
                        <button onClick={logWater}>+ 250ml</button>
                    </div>
                    <div>Progress: {waterIntake}/{waterTarget}ml</div>
                </div>
            )}

            {activeTab === 'custom' && (
                <div className="content">
                    <h3>Custom Reminder</h3>
                    <input type="time" value={customTime} onChange={(e) => setCustomTime(e.target.value)} />
                    <input type="text" value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} placeholder="Reminder message" />
                    <input type="url" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} placeholder="URL (optional)" />
                    <button onClick={setCustomReminder}>Set Reminder</button>
                </div>
            )}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root')); 