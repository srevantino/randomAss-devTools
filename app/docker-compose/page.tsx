"use client"

import { useState } from "react"
import { ToolLayout } from "@/components/tool-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Copy, Plus, Trash2, Check, Download } from "lucide-react"

interface Port {
  host: string
  container: string
}

interface Volume {
  host: string
  container: string
  type: "bind" | "volume"
}

interface EnvVar {
  key: string
  value: string
}

interface Service {
  id: string
  name: string
  image: string
  ports: Port[]
  volumes: Volume[]
  environment: EnvVar[]
  restart: string
  networks: string[]
  dependsOn: string[]
}

interface VolumeDefinition {
  name: string
  driver: string
}

interface NetworkDefinition {
  name: string
  driver: string
}

const defaultService: () => Service = () => ({
  id: crypto.randomUUID(),
  name: "",
  image: "",
  ports: [],
  volumes: [],
  environment: [],
  restart: "unless-stopped",
  networks: [],
  dependsOn: []
})

export default function DockerComposePage() {
  const [services, setServices] = useState<Service[]>([defaultService()])
  const [volumeDefs, setVolumeDefs] = useState<VolumeDefinition[]>([])
  const [networkDefs, setNetworkDefs] = useState<NetworkDefinition[]>([])
  const [composeVersion, setComposeVersion] = useState("3.8")
  const [copied, setCopied] = useState(false)

  const addService = () => {
    setServices([...services, defaultService()])
  }

  const removeService = (id: string) => {
    if (services.length > 1) {
      setServices(services.filter(s => s.id !== id))
    }
  }

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const addPort = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateService(serviceId, { ports: [...service.ports, { host: "", container: "" }] })
    }
  }

  const removePort = (serviceId: string, index: number) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateService(serviceId, { ports: service.ports.filter((_, i) => i !== index) })
    }
  }

  const updatePort = (serviceId: string, index: number, updates: Partial<Port>) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      const newPorts = [...service.ports]
      newPorts[index] = { ...newPorts[index], ...updates }
      updateService(serviceId, { ports: newPorts })
    }
  }

  const addVolume = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateService(serviceId, { volumes: [...service.volumes, { host: "", container: "", type: "bind" }] })
    }
  }

  const removeVolume = (serviceId: string, index: number) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateService(serviceId, { volumes: service.volumes.filter((_, i) => i !== index) })
    }
  }

  const updateVolume = (serviceId: string, index: number, updates: Partial<Volume>) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      const newVolumes = [...service.volumes]
      newVolumes[index] = { ...newVolumes[index], ...updates }
      updateService(serviceId, { volumes: newVolumes })
    }
  }

  const addEnvVar = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateService(serviceId, { environment: [...service.environment, { key: "", value: "" }] })
    }
  }

  const removeEnvVar = (serviceId: string, index: number) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      updateService(serviceId, { environment: service.environment.filter((_, i) => i !== index) })
    }
  }

  const updateEnvVar = (serviceId: string, index: number, updates: Partial<EnvVar>) => {
    const service = services.find(s => s.id === serviceId)
    if (service) {
      const newEnv = [...service.environment]
      newEnv[index] = { ...newEnv[index], ...updates }
      updateService(serviceId, { environment: newEnv })
    }
  }

  const addVolumeDef = () => {
    setVolumeDefs([...volumeDefs, { name: "", driver: "local" }])
  }

  const addNetworkDef = () => {
    setNetworkDefs([...networkDefs, { name: "", driver: "bridge" }])
  }

  const generateYaml = () => {
    let yaml = `version: "${composeVersion}"\n\nservices:\n`

    for (const service of services) {
      if (!service.name || !service.image) continue
      
      yaml += `  ${service.name}:\n`
      yaml += `    image: ${service.image}\n`
      yaml += `    container_name: ${service.name}\n`
      
      if (service.restart) {
        yaml += `    restart: ${service.restart}\n`
      }

      if (service.ports.length > 0) {
        const validPorts = service.ports.filter(p => p.host && p.container)
        if (validPorts.length > 0) {
          yaml += `    ports:\n`
          for (const port of validPorts) {
            yaml += `      - "${port.host}:${port.container}"\n`
          }
        }
      }

      if (service.volumes.length > 0) {
        const validVolumes = service.volumes.filter(v => v.host && v.container)
        if (validVolumes.length > 0) {
          yaml += `    volumes:\n`
          for (const vol of validVolumes) {
            yaml += `      - ${vol.host}:${vol.container}\n`
          }
        }
      }

      if (service.environment.length > 0) {
        const validEnv = service.environment.filter(e => e.key)
        if (validEnv.length > 0) {
          yaml += `    environment:\n`
          for (const env of validEnv) {
            yaml += `      - ${env.key}=${env.value}\n`
          }
        }
      }

      if (service.networks.length > 0) {
        yaml += `    networks:\n`
        for (const net of service.networks) {
          yaml += `      - ${net}\n`
        }
      }

      if (service.dependsOn.length > 0) {
        yaml += `    depends_on:\n`
        for (const dep of service.dependsOn) {
          yaml += `      - ${dep}\n`
        }
      }

      yaml += `\n`
    }

    if (volumeDefs.length > 0) {
      const validVolumes = volumeDefs.filter(v => v.name)
      if (validVolumes.length > 0) {
        yaml += `volumes:\n`
        for (const vol of validVolumes) {
          yaml += `  ${vol.name}:\n`
          yaml += `    driver: ${vol.driver}\n`
        }
        yaml += `\n`
      }
    }

    if (networkDefs.length > 0) {
      const validNetworks = networkDefs.filter(n => n.name)
      if (validNetworks.length > 0) {
        yaml += `networks:\n`
        for (const net of validNetworks) {
          yaml += `  ${net.name}:\n`
          yaml += `    driver: ${net.driver}\n`
        }
      }
    }

    return yaml.trim()
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateYaml())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadYaml = () => {
    const blob = new Blob([generateYaml()], { type: "text/yaml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "docker-compose.yml"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <ToolLayout
      title="Docker Compose Builder"
      description="Visual UI to build docker-compose.yml files with services, volumes, and networks."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Builder Panel */}
        <div className="space-y-6">
          {/* Version */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">Compose Version</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={composeVersion} onValueChange={setComposeVersion}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3.8">3.8</SelectItem>
                  <SelectItem value="3.9">3.9</SelectItem>
                  <SelectItem value="3.7">3.7</SelectItem>
                  <SelectItem value="2.4">2.4</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Services */}
          {services.map((service, serviceIndex) => (
            <Card key={service.id} className="bg-card border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">
                  Service {serviceIndex + 1}
                </CardTitle>
                {services.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Service Name</Label>
                    <Input
                      placeholder="my-service"
                      value={service.name}
                      onChange={(e) => updateService(service.id, { name: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Image</Label>
                    <Input
                      placeholder="nginx:latest"
                      value={service.image}
                      onChange={(e) => updateService(service.id, { image: e.target.value })}
                      className="bg-secondary border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Restart Policy</Label>
                  <Select
                    value={service.restart}
                    onValueChange={(value) => updateService(service.id, { restart: value })}
                  >
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">no</SelectItem>
                      <SelectItem value="always">always</SelectItem>
                      <SelectItem value="on-failure">on-failure</SelectItem>
                      <SelectItem value="unless-stopped">unless-stopped</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ports */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Ports</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary hover:text-primary"
                      onClick={() => addPort(service.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Port
                    </Button>
                  </div>
                  {service.ports.map((port, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="8080"
                        value={port.host}
                        onChange={(e) => updatePort(service.id, index, { host: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <span className="text-muted-foreground">:</span>
                      <Input
                        placeholder="80"
                        value={port.container}
                        onChange={(e) => updatePort(service.id, index, { container: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removePort(service.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Volumes */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Volumes</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary hover:text-primary"
                      onClick={() => addVolume(service.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Volume
                    </Button>
                  </div>
                  {service.volumes.map((vol, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="./data"
                        value={vol.host}
                        onChange={(e) => updateVolume(service.id, index, { host: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <span className="text-muted-foreground">:</span>
                      <Input
                        placeholder="/var/lib/data"
                        value={vol.container}
                        onChange={(e) => updateVolume(service.id, index, { container: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeVolume(service.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Environment Variables */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Environment</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-primary hover:text-primary"
                      onClick={() => addEnvVar(service.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Env
                    </Button>
                  </div>
                  {service.environment.map((env, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="KEY"
                        value={env.key}
                        onChange={(e) => updateEnvVar(service.id, index, { key: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <span className="text-muted-foreground">=</span>
                      <Input
                        placeholder="value"
                        value={env.value}
                        onChange={(e) => updateEnvVar(service.id, index, { value: e.target.value })}
                        className="bg-secondary border-border"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeEnvVar(service.id, index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Depends On */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Depends On (other services)</Label>
                  <div className="flex flex-wrap gap-2">
                    {services
                      .filter(s => s.id !== service.id && s.name)
                      .map(s => (
                        <label key={s.id} className="flex items-center gap-2 text-sm">
                          <Switch
                            checked={service.dependsOn.includes(s.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateService(service.id, { dependsOn: [...service.dependsOn, s.name] })
                              } else {
                                updateService(service.id, { dependsOn: service.dependsOn.filter(d => d !== s.name) })
                              }
                            }}
                          />
                          <span className="text-muted-foreground">{s.name}</span>
                        </label>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button onClick={addService} variant="outline" className="w-full border-border">
            <Plus className="h-4 w-4 mr-2" /> Add Service
          </Button>

          {/* Volumes & Networks */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">Volumes</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary hover:text-primary"
                  onClick={addVolumeDef}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {volumeDefs.map((vol, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="volume_name"
                      value={vol.name}
                      onChange={(e) => {
                        const newVols = [...volumeDefs]
                        newVols[index].name = e.target.value
                        setVolumeDefs(newVols)
                      }}
                      className="bg-secondary border-border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setVolumeDefs(volumeDefs.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {volumeDefs.length === 0 && (
                  <p className="text-xs text-muted-foreground">No named volumes defined</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-foreground">Networks</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-primary hover:text-primary"
                  onClick={addNetworkDef}
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {networkDefs.map((net, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="network_name"
                      value={net.name}
                      onChange={(e) => {
                        const newNets = [...networkDefs]
                        newNets[index].name = e.target.value
                        setNetworkDefs(newNets)
                      }}
                      className="bg-secondary border-border"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setNetworkDefs(networkDefs.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {networkDefs.length === 0 && (
                  <p className="text-xs text-muted-foreground">No custom networks defined</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-foreground">docker-compose.yml</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-border"
                  onClick={downloadYaml}
                >
                  <Download className="h-3 w-3 mr-1" /> Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-border"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary rounded-lg p-4 text-sm font-mono text-foreground overflow-x-auto max-h-[600px] overflow-y-auto">
                {generateYaml()}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  )
}
