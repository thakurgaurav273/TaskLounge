import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import CreateIssue from '../components/ui/CreateIssue';
import Content from '../components/Content';
import { setShowVoiceCommand, setUsersList } from '../app/slices/appSlice';
import { useEffect, useState } from 'react';
import VoiceIssueCreator, { type ExtractedIssueData } from '../components/ui/SpeechToText';

const Home = () => {
    const showCreateIssue = useSelector((state: any) => state.showCreateIssue);
    const showVoiceCommand = useSelector((state: any) => state.showVoiceCommand);

    const dispatch = useDispatch();
    const [extractedData, setExtractedData] = useState<ExtractedIssueData | null>(null);

    const fetchUsers = async () => {
        const response = await fetch("http://localhost:8080/api/users", {
            method: 'GET',
        }).then((data) => data.json())

        dispatch(setUsersList(response.users));
    }

    useEffect(() => {
        fetchUsers();
    }, [])

    const handleData = (data: ExtractedIssueData) => {
        setExtractedData(data);
        dispatch(setShowVoiceCommand(false));
    }
    const handleClose = () => {
        dispatch(setShowVoiceCommand(false));
    }
    console.log(extractedData, showCreateIssue)
    return (
        <div className='App flex'>
            <Sidebar />
            <Content />
            {(showCreateIssue || extractedData) && <CreateIssue issue={extractedData} extractedData={extractedData} setExtractedData={setExtractedData} />}
            {showVoiceCommand && <VoiceIssueCreator onIssueExtracted={handleData} onCloseRequest={handleClose} />
            }
        </div>
    )
}

export default Home
