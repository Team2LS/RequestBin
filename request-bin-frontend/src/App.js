import {
  jsx as _jsx,
  Fragment as _Fragment,
  jsxs as _jsxs,
} from "react/jsx-runtime";
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
const NoBin = () => {
  const navigate = useNavigate();
  const createNewBin = () => {
    requestService.getNewBin().then((data) => {
      localBins.saveBinId(data);
      navigate(`/${String(data)}`);
    });
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx("div", {
        className: "float-end",
        children: _jsx(Button, { onClick: createNewBin, children: "New Hole" }),
      }),
      _jsx("br", {}),
      _jsx("p", { children: "Create a bin to get started" }),
    ],
  });
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
  const handleRequestInfoClick = (webhook) => {
    requestService
      .getPayloadByMongoId(webhook["mongo_id"])
      .then(setRequestDetail)
      .then(() => setReqInfo(webhook));
  };
  return _jsxs(_Fragment, {
    children: [
      _jsx(BinNav, {
        binId: currentBinId,
        setWebhooks: setWebhooks,
        refreshList: refreshList,
        allBins: allBins,
      }),
      _jsxs(Stack, {
        className: "overflow-auto",
        direction: "horizontal",
        children: [
          _jsx(RequestNav, {
            webhooks: webhooks,
            handleRequestInfoClick: handleRequestInfoClick,
          }),
          _jsx(Request, {
            noWebhooks: webhooks.length === 0,
            reqInfo: reqInfo,
            reqPayload: requestDetail,
          }),
        ],
      }),
    ],
  });
};
const RequestNav = ({ webhooks, handleRequestInfoClick }) => {
  return _jsx(Stack, {
    className: "overflow-auto",
    style: { height: "80vh", width: "30vw", position: "relative" },
    children: webhooks.map((webhook) =>
      _jsx(
        Card,
        {
          type: "button",
          className: "btn btn-outline-dark",
          onClick: () => handleRequestInfoClick(webhook),
          children: _jsx(WebhookInfo, {
            request_method: webhook["http_method"],
            http_path: webhook["http_path"],
          }),
        },
        webhook["id"]
      )
    ),
  });
};
const Header = () => {
  return _jsx(Stack, {
    direction: "horizontal",
    style: { background: "black", color: "white", padding: 5 },
    children: _jsx("p", { children: "Requests Hit Hole" }),
  });
};
const BinNav = ({ binId, refreshList, setWebhooks, allBins }) => {
  const navigate = useNavigate();
  const createNewBin = () => {
    requestService.getNewBin().then((data) => {
      localBins.saveBinId(data);
      navigate(`/${String(data)}`);
    });
  };
  return _jsxs(Stack, {
    direction: "horizontal",
    style: { background: "green" },
    children: [
      _jsxs(Dropdown, {
        children: [
          _jsx(Dropdown.Toggle, {
            variant: "success",
            id: "dropdown-basic",
            children: "Holes",
          }),
          _jsx(Dropdown.Menu, {
            children: allBins.map((bin) => {
              return _jsx(
                Dropdown.Item,
                { href: `/${bin}`, children: bin },
                bin
              );
            }),
          }),
        ],
      }),
      binId == undefined
        ? _jsx("h2", { children: "Please select a bin from the dropdown" })
        : _jsxs("h2", {
            children: [
              "Your endpoint is ",
              `http://${binId}.x.requestshithole.com`,
            ],
          }),
      _jsx(Button, {
        className: "ms-auto",
        onClick: createNewBin,
        children: "New Hole",
      }),
      _jsx(Button, {
        onClick: () => refreshList(setWebhooks, binId),
        children: "Refresh List",
      }),
    ],
  });
};
const App = () => {
  const [allBins, setAllBins] = useState(localBins.getSavedBinIds());
  const [webhooks, setWebhooks] = useState([]);
  const [requestDetail, setRequestDetail] = useState("");
  return _jsx("div", {
    style: { padding: 0, height: "100vh", width: "100vw", position: "fixed" },
    children: _jsxs(Stack, {
      style: { padding: 0, height: "100%" },
      children: [
        _jsx(Header, {}),
        _jsx(Router, {
          children: _jsxs(Routes, {
            children: [
              _jsx(Route, { path: "/", element: _jsx(NoBin, {}) }),
              _jsx(Route, {
                path: "/:binId",
                element: _jsx(SpecifiedBin, {
                  webhooks: webhooks,
                  setWebhooks: setWebhooks,
                  requestDetail: requestDetail,
                  setRequestDetail: setRequestDetail,
                  allBins: allBins,
                }),
              }),
            ],
          }),
        }),
      ],
    }),
  });
};
export default App;
