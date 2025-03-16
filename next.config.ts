import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "unsplash.com",
			},
			{
				protocol: "https",
				hostname: "pub-2908e8e43ed4461a896882e3b99c8713.r2.dev",
			},
		],
	},
	webpack(config) {
		// Grab the existing rule that handles SVG imports
		const fileLoaderRule: {
			test?: { test?: (path: string) => boolean };
			issuer?: { test?: (path: string) => boolean };
			resourceQuery?: { not?: RegExp[] };
			exclude?: RegExp;
		} = config.module.rules.find(
			(rule: { test?: { test?: (path: string) => boolean } }) =>
				rule.test?.test?.(".svg")
		);

		config.module.rules.push(
			// Reapply the existing rule, but only for svg imports ending in ?url
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/, // *.svg?url
			},
			// Convert all other *.svg imports to React components
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: {
					not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
				}, // exclude if *.svg?url
				use: ["@svgr/webpack"],
			}
		);

		// Modify the file loader rule to ignore *.svg, since we have it handled now.
		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	},
};

export default nextConfig;
