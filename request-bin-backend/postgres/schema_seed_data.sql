--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Homebrew)
-- Dumped by pg_dump version 14.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bins; Type: TABLE; Schema: public; Owner: alex
--

CREATE TABLE public.bins (
    id integer NOT NULL,
    url_path character varying NOT NULL
);


ALTER TABLE public.bins OWNER TO alex;

--
-- Name: bins_id_seq; Type: SEQUENCE; Schema: public; Owner: alex
--

CREATE SEQUENCE public.bins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bins_id_seq OWNER TO alex;

--
-- Name: bins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alex
--

ALTER SEQUENCE public.bins_id_seq OWNED BY public.bins.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: alex
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    bin_id integer NOT NULL,
    mongo_id character varying NOT NULL,
    http_method character varying NOT NULL,
    http_path character varying NOT NULL
);


ALTER TABLE public.requests OWNER TO alex;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: alex
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requests_id_seq OWNER TO alex;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: alex
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;


--
-- Name: bins id; Type: DEFAULT; Schema: public; Owner: alex
--

ALTER TABLE ONLY public.bins ALTER COLUMN id SET DEFAULT nextval('public.bins_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: alex
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Data for Name: bins; Type: TABLE DATA; Schema: public; Owner: alex
--

COPY public.bins (id, url_path) FROM stdin;
1	localhost
2	localhost:3001
3	asdf
4	asdfasdf
5	696b-75-164-63-193
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: alex
--

COPY public.requests (id, bin_id, mongo_id, http_method, http_path) FROM stdin;
14	5	65b7253e6cadfe2fbc0bc77c	POST	696b-75-164-63-193
15	5	65b725456cadfe2fbc0bc77e	POST	696b-75-164-63-193
16	5	65b725476cadfe2fbc0bc780	POST	696b-75-164-63-193
17	5	65b7285ba70a0d79f01ac5cd	POST	696b-75-164-63-193
18	5	65b7288f8891da7131c81adc	POST	696b-75-164-63-193
19	5	65b728948891da7131c81ade	POST	696b-75-164-63-193
\.


--
-- Name: bins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alex
--

SELECT pg_catalog.setval('public.bins_id_seq', 5, true);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: alex
--

SELECT pg_catalog.setval('public.requests_id_seq', 19, true);


--
-- Name: bins bins_pkey; Type: CONSTRAINT; Schema: public; Owner: alex
--

ALTER TABLE ONLY public.bins
    ADD CONSTRAINT bins_pkey PRIMARY KEY (id);


--
-- Name: bins bins_url_path_key; Type: CONSTRAINT; Schema: public; Owner: alex
--

ALTER TABLE ONLY public.bins
    ADD CONSTRAINT bins_url_path_key UNIQUE (url_path);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: alex
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: requests requests_bin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: alex
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_bin_id_fkey FOREIGN KEY (bin_id) REFERENCES public.bins(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

