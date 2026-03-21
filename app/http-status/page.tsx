"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatusCode {
  code: number
  name: string
  description: string
  causes?: string[]
}

interface StatusCategory {
  range: string
  name: string
  description: string
  color: string
  codes: StatusCode[]
}

const statusCodes: StatusCategory[] = [
  {
    range: "1xx",
    name: "Informational",
    description: "Request received, continuing process",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    codes: [
      {
        code: 100,
        name: "Continue",
        description: "The server has received the request headers and the client should proceed to send the request body.",
        causes: ["Large file upload in progress", "Client waiting for server confirmation before sending body"]
      },
      {
        code: 101,
        name: "Switching Protocols",
        description: "The server is switching to a different protocol as requested by the client.",
        causes: ["Upgrading from HTTP to WebSocket", "Protocol upgrade request accepted"]
      },
      {
        code: 102,
        name: "Processing",
        description: "The server has received and is processing the request, but no response is available yet.",
        causes: ["WebDAV request processing", "Long-running request in progress"]
      },
      {
        code: 103,
        name: "Early Hints",
        description: "Used to return some response headers before final HTTP message.",
        causes: ["Preloading resources", "Link header hints for resource loading"]
      }
    ]
  },
  {
    range: "2xx",
    name: "Success",
    description: "Request was successfully received, understood, and accepted",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    codes: [
      {
        code: 200,
        name: "OK",
        description: "The request has succeeded. The meaning depends on the HTTP method used.",
        causes: ["Successful GET request", "Successful POST form submission", "API call completed successfully"]
      },
      {
        code: 201,
        name: "Created",
        description: "The request has succeeded and a new resource has been created as a result.",
        causes: ["New user account created", "New record inserted in database", "File upload completed"]
      },
      {
        code: 202,
        name: "Accepted",
        description: "The request has been accepted for processing, but the processing has not been completed.",
        causes: ["Background job queued", "Async operation started", "Request added to processing queue"]
      },
      {
        code: 203,
        name: "Non-Authoritative Information",
        description: "The returned metadata is not exactly the same as available from the origin server.",
        causes: ["Response modified by proxy", "Cached response from intermediary"]
      },
      {
        code: 204,
        name: "No Content",
        description: "The server successfully processed the request and is not returning any content.",
        causes: ["Successful DELETE request", "Form submission with no redirect", "Update operation completed"]
      },
      {
        code: 205,
        name: "Reset Content",
        description: "The server successfully processed the request and asks the client to reset the document view.",
        causes: ["Form cleared after submission", "Document view should be reset"]
      },
      {
        code: 206,
        name: "Partial Content",
        description: "The server is delivering only part of the resource due to a range header sent by the client.",
        causes: ["Video streaming", "Resumable download", "Large file partial request"]
      },
      {
        code: 207,
        name: "Multi-Status",
        description: "Conveys information about multiple resources in situations where multiple status codes might be appropriate.",
        causes: ["WebDAV multi-resource response", "Batch operation results"]
      }
    ]
  },
  {
    range: "3xx",
    name: "Redirection",
    description: "Further action needs to be taken to complete the request",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    codes: [
      {
        code: 300,
        name: "Multiple Choices",
        description: "The request has more than one possible response. The user should choose one of them.",
        causes: ["Multiple representations available", "Content negotiation required"]
      },
      {
        code: 301,
        name: "Moved Permanently",
        description: "The requested resource has been permanently moved to a new URL.",
        causes: ["Website restructure", "Domain change", "URL permanently changed"]
      },
      {
        code: 302,
        name: "Found",
        description: "The requested resource temporarily resides under a different URL.",
        causes: ["Temporary redirect", "Load balancing", "A/B testing redirect"]
      },
      {
        code: 303,
        name: "See Other",
        description: "The response to the request can be found at another URL using GET method.",
        causes: ["Post/Redirect/Get pattern", "Form submission redirect"]
      },
      {
        code: 304,
        name: "Not Modified",
        description: "The resource has not been modified since the version specified by the request headers.",
        causes: ["Browser cache still valid", "Conditional GET request", "ETag or Last-Modified match"]
      },
      {
        code: 307,
        name: "Temporary Redirect",
        description: "The request should be repeated with another URL, but future requests should still use the original URL.",
        causes: ["Temporary redirect preserving method", "HTTPS upgrade redirect"]
      },
      {
        code: 308,
        name: "Permanent Redirect",
        description: "The request should be repeated with another URL and future requests should use the new URL.",
        causes: ["Permanent redirect preserving method", "URL structure change"]
      }
    ]
  },
  {
    range: "4xx",
    name: "Client Error",
    description: "The request contains bad syntax or cannot be fulfilled",
    color: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    codes: [
      {
        code: 400,
        name: "Bad Request",
        description: "The server cannot process the request due to malformed syntax.",
        causes: ["Invalid JSON in request body", "Missing required parameters", "Malformed request headers"]
      },
      {
        code: 401,
        name: "Unauthorized",
        description: "Authentication is required and has failed or has not been provided.",
        causes: ["Missing authentication token", "Invalid credentials", "Expired session"]
      },
      {
        code: 402,
        name: "Payment Required",
        description: "Reserved for future use. Originally intended for digital payment systems.",
        causes: ["Subscription required", "Payment needed to access resource"]
      },
      {
        code: 403,
        name: "Forbidden",
        description: "The server understood the request but refuses to authorize it.",
        causes: ["Insufficient permissions", "IP blocked", "Resource access denied", "CORS policy violation"]
      },
      {
        code: 404,
        name: "Not Found",
        description: "The requested resource could not be found on the server.",
        causes: ["Page does not exist", "Resource deleted", "Typo in URL", "Broken link"]
      },
      {
        code: 405,
        name: "Method Not Allowed",
        description: "The request method is not supported for the requested resource.",
        causes: ["Using POST on GET-only endpoint", "DELETE not allowed", "Method not implemented"]
      },
      {
        code: 406,
        name: "Not Acceptable",
        description: "The requested resource cannot generate content acceptable according to Accept headers.",
        causes: ["Content type not supported", "Accept header mismatch"]
      },
      {
        code: 407,
        name: "Proxy Authentication Required",
        description: "The client must first authenticate with a proxy.",
        causes: ["Proxy credentials required", "Proxy authentication failed"]
      },
      {
        code: 408,
        name: "Request Timeout",
        description: "The server timed out waiting for the request.",
        causes: ["Slow network connection", "Request took too long", "Client idle timeout"]
      },
      {
        code: 409,
        name: "Conflict",
        description: "The request could not be processed because of conflict in the current state of the resource.",
        causes: ["Edit conflict", "Duplicate entry", "Concurrent modification", "Version mismatch"]
      },
      {
        code: 410,
        name: "Gone",
        description: "The requested resource is no longer available and will not be available again.",
        causes: ["Resource permanently deleted", "API endpoint deprecated", "Content removed"]
      },
      {
        code: 411,
        name: "Length Required",
        description: "The server requires a Content-Length header in the request.",
        causes: ["Missing Content-Length header", "Chunked transfer not supported"]
      },
      {
        code: 412,
        name: "Precondition Failed",
        description: "One or more conditions in the request header fields evaluated to false.",
        causes: ["If-Match header failed", "Conditional request failed", "ETag mismatch"]
      },
      {
        code: 413,
        name: "Payload Too Large",
        description: "The request entity is larger than limits defined by the server.",
        causes: ["File upload too large", "Request body exceeds limit", "Image too big"]
      },
      {
        code: 414,
        name: "URI Too Long",
        description: "The URI requested by the client is longer than the server is willing to interpret.",
        causes: ["Query string too long", "Too many URL parameters"]
      },
      {
        code: 415,
        name: "Unsupported Media Type",
        description: "The media format of the requested data is not supported by the server.",
        causes: ["Wrong Content-Type header", "Unsupported file format", "Invalid encoding"]
      },
      {
        code: 418,
        name: "I'm a Teapot",
        description: "The server refuses to brew coffee because it is, permanently, a teapot.",
        causes: ["Easter egg response", "HTCPCP protocol joke", "April Fools RFC 2324"]
      },
      {
        code: 422,
        name: "Unprocessable Entity",
        description: "The server understands the content type but was unable to process the contained instructions.",
        causes: ["Validation errors", "Semantic errors in request", "Business logic violation"]
      },
      {
        code: 429,
        name: "Too Many Requests",
        description: "The user has sent too many requests in a given amount of time.",
        causes: ["Rate limit exceeded", "API quota reached", "DDoS protection triggered"]
      },
      {
        code: 451,
        name: "Unavailable For Legal Reasons",
        description: "The resource is unavailable due to legal reasons.",
        causes: ["Content censored", "DMCA takedown", "Legal restrictions", "Government block"]
      }
    ]
  },
  {
    range: "5xx",
    name: "Server Error",
    description: "The server failed to fulfill a valid request",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
    codes: [
      {
        code: 500,
        name: "Internal Server Error",
        description: "The server has encountered a situation it doesn't know how to handle.",
        causes: ["Unhandled exception", "Programming bug", "Server misconfiguration", "Database error"]
      },
      {
        code: 501,
        name: "Not Implemented",
        description: "The server does not support the functionality required to fulfill the request.",
        causes: ["Feature not implemented", "HTTP method not supported", "API version mismatch"]
      },
      {
        code: 502,
        name: "Bad Gateway",
        description: "The server received an invalid response from an upstream server.",
        causes: ["Upstream server down", "Proxy configuration error", "Network issue between servers"]
      },
      {
        code: 503,
        name: "Service Unavailable",
        description: "The server is not ready to handle the request. Common causes are maintenance or overload.",
        causes: ["Server overloaded", "Maintenance mode", "Temporary unavailability", "Resource exhausted"]
      },
      {
        code: 504,
        name: "Gateway Timeout",
        description: "The server was acting as a gateway and did not receive a timely response.",
        causes: ["Upstream server timeout", "Slow database query", "Long-running process", "Network timeout"]
      },
      {
        code: 505,
        name: "HTTP Version Not Supported",
        description: "The server does not support the HTTP protocol version used in the request.",
        causes: ["Outdated HTTP version", "Protocol mismatch"]
      },
      {
        code: 507,
        name: "Insufficient Storage",
        description: "The server is unable to store the representation needed to complete the request.",
        causes: ["Disk full", "Quota exceeded", "Storage limit reached"]
      },
      {
        code: 508,
        name: "Loop Detected",
        description: "The server detected an infinite loop while processing the request.",
        causes: ["WebDAV infinite loop", "Circular redirect", "Recursive processing error"]
      },
      {
        code: 511,
        name: "Network Authentication Required",
        description: "The client needs to authenticate to gain network access.",
        causes: ["Captive portal", "WiFi login required", "Network proxy authentication"]
      }
    ]
  }
]

export default function HttpStatusPage() {
  const [search, setSearch] = useState("")
  const [selectedRange, setSelectedRange] = useState<string | null>(null)
  const [expandedCode, setExpandedCode] = useState<number | null>(null)

  const filteredCategories = statusCodes
    .map((category) => ({
      ...category,
      codes: category.codes.filter(
        (code) =>
          code.code.toString().includes(search) ||
          code.name.toLowerCase().includes(search.toLowerCase()) ||
          code.description.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.codes.length > 0 &&
        (!selectedRange || category.range === selectedRange)
    )

  return (
    <ToolLayout
      title="HTTP Status Code Reference"
      description="Browse all HTTP codes by category. Search by code or keyword to find descriptions and common causes."
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by code, name, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-input border-border text-foreground"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedRange === null ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedRange(null)}
          >
            All
          </Button>
          {statusCodes.map((category) => (
            <Button
              key={category.range}
              variant={selectedRange === category.range ? "default" : "secondary"}
              size="sm"
              onClick={() => setSelectedRange(category.range)}
              className={cn(
                selectedRange === category.range && category.color.split(" ")[0]
              )}
            >
              {category.range} {category.name}
            </Button>
          ))}
        </div>

        {/* Status Codes */}
        <div className="space-y-8">
          {filteredCategories.map((category) => (
            <div key={category.range}>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-sm font-bold border",
                    category.color
                  )}
                >
                  {category.range}
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {category.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {category.codes.map((code) => (
                  <Card
                    key={code.code}
                    className={cn(
                      "bg-card border-border cursor-pointer transition-all hover:border-primary/50",
                      expandedCode === code.code && "ring-1 ring-primary col-span-full"
                    )}
                    onClick={() =>
                      setExpandedCode(expandedCode === code.code ? null : code.code)
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-sm font-mono font-bold border shrink-0",
                            category.color
                          )}
                        >
                          {code.code}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground">
                            {code.name}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                            {code.description}
                          </p>
                        </div>
                      </div>

                      {expandedCode === code.code && code.causes && (
                        <div className="mt-4 pt-4 border-t border-border">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Common Causes
                          </span>
                          <ul className="mt-2 space-y-1">
                            {code.causes.map((cause, index) => (
                              <li
                                key={index}
                                className="text-sm text-foreground flex items-start gap-2"
                              >
                                <span className="text-primary mt-1.5 text-xs">
                                  &#8226;
                                </span>
                                {cause}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No status codes found matching your search
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  )
}
