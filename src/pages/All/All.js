import React from 'react'



// Lazy load components
const ColorPalette = React.lazy(() => import('../../component/asset component/color pallete/ColoePalette'));
const ComponentsPreview = React.lazy(() => import('../../component/asset component/Components preview/ComponentsPreview'));
const Home = React.lazy(() => import('../Home/Home'));
const Search = React.lazy(() => import('../Search/Search'));
const Playlist = React.lazy(() => import('../Playlist/Playlist'));
const SelectedPlaylist = React.lazy(() => import('../Playlist/PlaylistSelected'));
const PlayedVideo = React.lazy(() => import('../VideoPlaying/VideoPlaying'));
const RequestTest = React.lazy(() => import('../../component/asset component/RequestTest/RequestTest'));
const PlayedVideoTest = React.lazy(() => import('../../component/asset component/RequestTest/VideoPlaying/VideoPlaying'));
const ENoInternet = React.lazy(()=>import('../../component/MinorComponents/E404/E404'));



export {
    ColorPalette,
    ComponentsPreview,
    Home,
    Search,
    Playlist,
    SelectedPlaylist,
    PlayedVideo,
    RequestTest,
    PlayedVideoTest,
    ENoInternet,
}
