local identifier = "4Doors"

local discounts = {}
local sellers = {}

CreateThread(function ()
    while GetResourceState("lb-phone") ~= "started" do
        Wait(500)
    end

    local function AddApp()
        local added, errorMessage = exports["lb-phone"]:AddCustomApp({
            identifier = identifier,
            name = "4Doors",
            description = "We watch cars for ya",
            developer = "PLS",
            defaultApp = true, -- OPTIONAL if set to true, app should be added without having to download it,
            size = 59812, -- OPTIONAL in kb
            -- price = 0, -- OPTIONAL, Make players pay with in-game money to download the app
            images = {"https://example.com/photo.jpg"}, -- OPTIONAL array of images for the app on the app store

            ui = GetCurrentResourceName() .. "/ui/dist/index.html", -- built version
            -- ui = "http://localhost:3000", -- dev version

            icon = "https://cfx-nui-" .. GetCurrentResourceName() .. "/ui/icon.png"
        })

        if not added then
            print("Could not add app:", errorMessage)
        end
    end

    AddApp()

    AddEventHandler("onResourceStart", function(resource)
        if resource == "lb-phone" then
            AddApp()
        end
    end)

end)

RegisterNUICallback("drawNotification", function(data, cb)
    BeginTextCommandThefeedPost("STRING")
    AddTextComponentSubstringPlayerName(data.message)
    EndTextCommandThefeedPostTicker(false, false)

    cb("ok")
end)

local function updateData()
    exports["lb-phone"]:SendCustomAppMessage("4Doors", {
        type = 'updateData',
        discounts = discounts,
        sellers = sellers,
    })
end

function addDiscount(data)
    exports["lb-phone"]:SendNotification({
        app = "4Doors",
        title = "Discount alert - "..data.vehicleShopLabel, 
        content = "Special offer! "..data.vehicleLabel.." now has a discount "..data.discount.." PERCENT OFF", 
    })
    table.insert(discounts, data)
    updateData()
end

function addSeller(data)
    exports["lb-phone"]:SendNotification({
        app = "4Doors",
        title = "Someone selling vehicle "..data.vehicleLabel, 
        content = "Someone selling vehicle "..data.vehicleLabel.." for "..data.vehiclePrice.." USD",
    })
    table.insert(sellers, data)
    updateData()
end


Wait(2000)
updateData()

exports("addSeller", addSeller)
exports("addDiscount", addDiscount)

RegisterNUICallback("markSeller", function(data, cb)
    exports.pls_vehicleshop:navigateToSeller(data)
    cb("ok")
end)
