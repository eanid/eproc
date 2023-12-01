export let userdata = [
    {
        email: "pt@eproc.com",
        name: "Manager Eproc",
        password:
            "$argon2i$v=19$m=16,t=2,p=1$ZXByb2N1cmVtZW50$8wJIpO4pzxqxBEhYNA72pQ",
        companyName: "PT RJS",
        isVendor: true,
    },
    {
        email: "admin@vendorterbaik.com",
        name: "budi",
        password:
            "$argon2i$v=19$m=16,t=2,p=1$ZXByb2N1cmVtZW50$8wJIpO4pzxqxBEhYNA72pQ",
        companyName: "PT Vendor Terbaik",
        isVendor: false,
    },
    {
        email: "admin@vendortermantap.com",
        name: "yati",
        password:
            "$argon2i$v=19$m=16,t=2,p=1$ZXByb2N1cmVtZW50$8wJIpO4pzxqxBEhYNA72pQ",
        companyName: "PT Vendor Termantap",
        isVendor: false,
    },
];

export const procurementdata = [
    {
        itemName: "Item A",
        description: "Description for Item A",
        price: 100.0,
        userId: 1,
        vendorId: 2,
        // progress: 0,
        status: "sale",
        payment: "pending",
    },
];
