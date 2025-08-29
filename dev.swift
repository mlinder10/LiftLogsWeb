func attachToken(_ token: String, to request: inout URLRequest) {
  request.setValue("LiftLogsJWT=\(token)", forHTTPHeaderField: "Cookie")
}

func getToken(from response: HTTPURLResponse) -> String? {
  guard let headerFields = response.allHeaderFields as? [String: String] else { return nil }
  guard let url = response.url else { return nil }
  let cookies = HTTPCookie.cookies(withResponseHeaderFields: headerFields, for: url)
  let jwtCookie = cookies.first(where: { $0.name == "LiftLogsJWT" })
  return jwtCookie?.value
}