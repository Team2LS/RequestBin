import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
import requestService from "./services/requestService";
import { Button, Card, Stack, Dropdown } from "react-bootstrap";
import WebhookInfo from "./components/WebhookInfo";
import Request from "./components/Request";
import localBins from "./services/sessionPersistence";
import logo from "./assets/images/GravityPotential.jpg";

type JSONPrimitive = string | number | boolean | JSONObject | null | undefined;
type JSONObject = { [key: string]: JSONPrimitive } | JSONObject[];

const Header = () => {
  return (
    <Stack
      direction="horizontal"
      style={{
        background: "#A2DED2",
        color: "black",
        padding: 10,
        fontWeight: "bold",
      }}
    >
      <img
        src={logo}
        style={{
          mixBlendMode: "multiply",
          width: "50px",
          marginRight: "20px",
        }}
      />
      <p>Webhooks Gravity Well</p>
    </Stack>
  );
};

const BinNav = ({ binId, refreshList, setWebhooks, allBins }) => {
  const navigate = useNavigate();

  const createNewBin = () => {
    requestService.getNewBin().then((data) => {
      localBins.saveBinId(data);
      navigate(`/${String(data)}`);
    });
  };

  return (
    <Stack direction="horizontal" style={{ background: "#E0E0E0" }}>
      <Dropdown>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          style={{ background: "#FFFFFF", border: "none", color: "#9C9B9D" }}
        >
          Gravity Wells
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {allBins.map((bin) => {
            return (
              <Dropdown.Item href={`/${bin}`} key={bin}>
                {bin}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
      {binId == undefined ? (
        <h2>Please select a bin from the dropdown</h2>
      ) : (
        <>
          <h2>Your endpoint is: </h2>
          <h2
            style={{
              borderRadius: "10px",
              background: "#FFFFFF",
              marginLeft: "10px",
              padding: "10px",
            }}
          >{`http://${binId}.x.webhooksgravitywell.com`}</h2>
        </>
      )}
      <Button
        className="ms-auto"
        onClick={createNewBin}
        style={{ background: "#56555A", border: "none" }}
      >
        New Gravity Well
      </Button>
      <Button
        onClick={() => refreshList(setWebhooks, binId)}
        style={{ background: "#56555A", border: "none", marginLeft: "20px" }}
      >
        Refresh List
      </Button>
    </Stack>
  );
};

const NoBin = () => {
  const navigate = useNavigate();

  const createNewBin = () => {
    requestService.getNewBin().then((data) => {
      localBins.saveBinId(data);
      navigate(`/${String(data)}`);
    });
  };

  return (
    <>
      <div className="float-end">
        <Button
          onClick={createNewBin}
          style={{ background: "#56555A", border: "none" }}
        >
          New Gravity Well
        </Button>
      </div>
      <br></br>
      <p>Create a bin to get started</p>
    </>
  );
};

const SpecifiedBin = ({
  webhooks,
  setWebhooks,
  requestDetail,
  setRequestDetail,
  allBins,
}) => {
  const currentBinId = useParams().binId;
  const [reqInfo, setReqInfo] = useState(null);

  useEffect(() => {
    if (currentBinId) {
      requestService.getRequestsByBinId(currentBinId).then(setWebhooks);
    }
  }, []);

  const refreshList = (setWebhooks, currentBinId) => {
    requestService.getRequestsByBinId(currentBinId).then(setWebhooks);
  };

  const handleRequestInfoClick = (webhook): void => {
    requestService
      .getPayloadByMongoId(webhook["mongo_id"])
      .then(setRequestDetail)
      .then(() => setReqInfo(webhook));
  };

  return (
    <>
      <BinNav
        binId={currentBinId}
        setWebhooks={setWebhooks}
        refreshList={refreshList}
        allBins={allBins}
      />
      <Stack className="overflow-auto" direction="horizontal">
        <RequestNav
          webhooks={webhooks}
          handleRequestInfoClick={handleRequestInfoClick}
        />
        <Request
          noWebhooks={webhooks.length === 0}
          reqInfo={reqInfo}
          reqPayload={requestDetail}
        />
      </Stack>
    </>
  );
};

const RequestNav = ({ webhooks, handleRequestInfoClick }) => {
  return (
    <Stack
      className="overflow-auto"
      style={{ height: "80vh", width: "30vw", position: "relative" }}
    >
      {webhooks.map((webhook) => (
        <Card
          key={webhook["id"]}
          type="button"
          className="requests"
          onClick={() => handleRequestInfoClick(webhook)}
        >
          <WebhookInfo
            request_method={webhook["http_method"]}
            http_path={webhook["http_path"]}
          />
        </Card>
      ))}
    </Stack>
  );
};

const App = () => {
  const [allBins, setAllBins] = useState(localBins.getSavedBinIds());
  const [webhooks, setWebhooks] = useState([]);
  const [requestDetail, setRequestDetail] = useState("");

  return (
    <div
      style={{ padding: 0, height: "100vh", width: "100vw", position: "fixed" }}
    >
      <Stack style={{ padding: 0, height: "100%" }}>
        <Header />
        <Router>
          <Routes>
            {/* { (allBins.length > 0) && // TODO, this is a route for the baseURL but while there are local bins saved
              <Route path='/' element={<SpecifiedBin webhooks={webhooks} setWebhooks={setWebhooks} requestDetail = {requestDetail} setRequestDetail = {setRequestDetail} allBins={allBins}/>} />
            } */}
            <Route path="/" element={<NoBin />} />
            <Route
              path="/:binId"
              element={
                <SpecifiedBin
                  webhooks={webhooks}
                  setWebhooks={setWebhooks}
                  requestDetail={requestDetail}
                  setRequestDetail={setRequestDetail}
                  allBins={allBins}
                />
              }
            />
          </Routes>
        </Router>
      </Stack>
    </div>
  );
};

export default App;
