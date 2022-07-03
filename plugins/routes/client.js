const { database } = require("../../app");
const { ClientController, GameController, MenuController, TradingController, FriendController } = require("../controllers/client");
const { Weaponbuild } = require("../models");
const { logger, FastifyResponse } = require("../utilities");

module.exports = async function gameRoutes(app, _opts) {

    // Initial entry points for tarkov //
    app.get(`/mode/offline`, async (request, reply) => {
        await GameController.modeOfflinePatches(request, reply);
    });

    app.get(`/mode/offlineNodes`, async (request, reply) => {
        await GameController.modeOfflinePatchNodes(request, reply);
    });


    // Client Game Routes //
    app.post(`/client/game/config`, async (request, reply) => {
        await GameController.clientGameConfig(request, reply);
    });

    app.post(`/client/game/start`, async (request, reply) => {
        await GameController.clientGameStart(request, reply);
    });

    app.post(`/client/game/version/validate`, async (request, reply) => {
        await GameController.clientGameVersionValidate(request, reply);
    });

    app.post("/client/game/profile/list", async (request, reply) => {
        await GameController.clientProfileList(request, reply);
    });

    app.post("/client/game/profile/select", async (request, reply) => {
        await GameController.clientProfileSelect(request, reply);
    });

    app.post("/client/game/keepalive", async (request, reply) => {
        await GameController.clientGameKeepAlive(request, reply);
    });

    app.post("/client/game/profile/nickname/reserved", async (request, reply) => {
        await GameController.clientGameProfileNicknameReserved(request, reply);
    });

    app.post("/client/game/profile/nickname/validate", async (request, reply) => {
        await GameController.clientGameProfileNicknameValidate(request, reply);
    });

    app.post("/client/game/profile/create", async (request, reply) => {
        await GameController.clientGameProfileCreate(request, reply);
        await GameController.clientGameProfileCreateReply(request, reply);
    });

    // Client Account Routes //
    app.post("/client/account/customization", async (request, reply) => {
        await ClientController.clientAccountCustomization(request, reply);
    });


    // Client Notifier Routes //
    app.post("/client/notifier/channel/create", async (request, reply) => {
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody(FastifyResponse.getNotifier(await FastifyResponse.getSessionID(request)))
        );
    });

    // Client Profile Routes //
    app.post("/client/profile/status", async (request, reply) => {
        const sessionID = await FastifyResponse.getSessionID(request);
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody({
                maxPveCountExceeded: false,
                profiles: [
                    {
                        profileid: "scav" + sessionID,
                        profileToken: null,
                        status: "Free",
                        sid: "",
                        ip: "",
                        port: 0,
                    },
                    {
                        profileid: "pmc" + sessionID,
                        profileToken: null,
                        status: "Free",
                        sid: "",
                        ip: "",
                        port: 0,
                    }
                ]
            })
        );
    });

    // Client Handbook Routes //
    app.post("/client/handbook/templates", async (_request, reply) => {
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody(database.templates));
    });

    app.post(`/client/handbook/builds/my/list`, async (_request, reply) => {
        const output = await Weaponbuild.getAllWithoutKeys();
        console.log()
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody(await Weaponbuild.getAllWithoutKeys()));
    });

    // Client Menu Routes //
    app.post(`/client/menu/locale/:language`, async (request, reply) => {
        await MenuController.clientMenuLocale(request, reply);
    });

    app.post(`/client/locale/:language`, async (request, reply) => {
        await ClientController.clientLocale(request, reply);
    });

    // Trading Routes //
    app.post(`/client/trading/api/getTradersList`, async (request, reply) => {
        await TradingController.clientTradingApiGetTradersList(request, reply);
    });

    app.post(`/client/trading/api/traderSettings`, async (request, reply) => {
        await TradingController.clientTradingApiTraderSettings(request, reply);
    });

    app.post(`/client/trading/customization/storage`, async (request, reply) => {
        await TradingController.getStoragePath(request, reply);
    });

    // Ungrouped routes //
    app.post(`/client/customization`, async (request, reply) => {
        await ClientController.clientCustomization(request, reply);
    });

    app.post(`/client/items`, async (request, reply) => {
        await ClientController.clientItems(request, reply);
    });

    app.post(`/client/languages`, async (request, reply) => {
        await ClientController.clientLanguages(request, reply);
    });

    app.post(`/client/globals`, async (request, reply) => {
        await ClientController.clientGlobals(request, reply);
    });

    app.post(`/client/settings`, async (request, reply) => {
        await ClientController.clientSettings(request, reply);
    });

    app.post(`/client/weather`, async (request, reply) => {
        await ClientController.clientWeather(request, reply);
    });

    app.post(`/client/locations`, async (request, reply) => {
        await ClientController.clientLocations(request, reply);
    });

    // hideout routes

    app.post(`/client/hideout/areas`, async (request, reply) => {
        await ClientController.clientHideoutAreas(request, reply);
    });

    app.post(`/client/hideout/production/recipes`, async (request, reply) => {
        await ClientController.clientHideoutProductionRecipes(request, reply);
    });

    app.post(`/client/hideout/production/scavcase/recipes`, async (request, reply) => {
        await ClientController.clientHideoutProductionScavcaseRecipes(request, reply);
    });

    app.post(`/client/hideout/settings`, async (request, reply) => {
        await ClientController.clientHideoutSettings(request, reply);
    });

    // Client Friends Routes //
    app.post(`/client/friend/list`, async (request, reply) => {
        await FriendController.clientFriendRequestList(request, reply);
    });
    app.post(`/client/friend/request/list/inbox`, async (request, reply) => {
        await FriendController.clientFriendRequestListInbox(request, reply);
    });
    app.post(`/client/friend/request/list/outbox`, async (request, reply) => {
        await FriendController.clientFriendRequestListOutbox(request, reply);
    });


    // Client Mail Routes //
    app.post(`/client/mail/dialog/list`, async (request, reply) => {
        //use dialoguecontroller later but we're smoving it for now
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody([])
        );
    });

}
