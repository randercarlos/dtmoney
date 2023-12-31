/**
 * Encode an object as url query string parameters
 * - includes the leading "?" prefix
 * - example input — {key: "value", alpha: "beta"}
 * - example output — output "?key=value&alpha=beta"
 * - returns empty string when given an empty object
 */
 export function encodeQueryString(params: object) {
  const keys = Object.keys(params)
  return keys.length
      ? "?" + keys
          .map(key => encodeURIComponent(key)
              + "=" + encodeURIComponent(params[key]))
          .join("&")
      : ""
}

// encodeQueryString({key: "value", alpha: "beta"}) // "?key=value&alpha=beta"
